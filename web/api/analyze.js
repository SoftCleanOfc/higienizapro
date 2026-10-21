const rateLimit = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 6;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = String(Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || (req.socket && req.socket.remoteAddress) || 'unknown').split(',')[0].trim();
  const now = Date.now();
  let limit = rateLimit.get(clientIp);
  if (!limit || now - limit.startedAt >= RATE_WINDOW_MS) limit = { startedAt: now, count: 0 };
  limit.count += 1;
  rateLimit.set(clientIp, limit);
  if (rateLimit.size > 1000) {
    for (const [ip, entry] of rateLimit) {
      if (now - entry.startedAt >= RATE_WINDOW_MS) rateLimit.delete(ip);
    }
  }
  if (limit.count > RATE_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Muitas análises em pouco tempo. Aguarde alguns minutos antes de tentar novamente.' });
  }

  // Mantém o nome da variável já configurada no Vercel. O valor deve ser uma chave
  // do Google AI Studio/Gemini, não uma chave da OpenAI.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      code: 'AI_NOT_CONFIGURED',
      error: 'A análise por IA não está habilitada. Configure OPENAI_API_KEY nas variáveis de ambiente do Vercel com sua chave do Google AI Studio.'
    });
  }

  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image : '';
    const imageMatch = image.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!imageMatch || image.length > 3500000) {
      return res.status(400).json({ error: 'A imagem não é válida ou ficou grande demais. Escolha uma foto mais leve.' });
    }

    const mimeType = 'image/' + imageMatch[1];
    const imageBase64 = imageMatch[2];
    const clean = (value, max = 500) => String(value == null ? '' : value).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
    const fabric = clean(body.fabric, 80) || 'não identificado pelo usuário';
    const stain = clean(body.stain, 100) || 'não informado';
    const notes = clean(body.notes, 700);
    const products = Array.isArray(body.products) ? body.products.slice(0, 60).map((p) => ({
      name: clean(p && p.name, 100),
      brand: clean(p && p.brand, 60),
      category: clean(p && p.category, 50),
      desc: clean(p && p.desc, 350),
      surfaces: clean(p && p.surfaces, 300),
      method: clean(p && p.method, 650),
      safety: clean(p && p.safety, 400),
      dilutionText: clean(p && p.dilutionText, 300),
      readyToUse: Boolean(p && p.readyToUse),
      noCalculator: Boolean(p && p.noCalculator)
    })).filter((p) => p.name && p.brand) : [];

    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        summary: { type: 'string' },
        fabric_guess: { type: 'string' },
        fabric_confidence: { type: 'string', enum: ['alta', 'média', 'baixa', 'indeterminada'] },
        stain_guess: { type: 'string' },
        stain_confidence: { type: 'string', enum: ['alta', 'média', 'baixa', 'indeterminada'] },
        soil_level: { type: 'string', enum: ['leve', 'média', 'pesada', 'indeterminada'] },
        visible_signs: { type: 'array', items: { type: 'string' } },
        recommended_products: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              name: { type: 'string' },
              reason: { type: 'string' }
            },
            required: ['name', 'reason']
          }
        },
        steps: { type: 'array', items: { type: 'string' } },
        avoid: { type: 'array', items: { type: 'string' } },
        cautions: { type: 'array', items: { type: 'string' } },
        need_more_info: { type: 'array', items: { type: 'string' } }
      },
      required: [
        'summary', 'fabric_guess', 'fabric_confidence', 'stain_guess', 'stain_confidence',
        'soil_level', 'visible_signs', 'recommended_products', 'steps', 'avoid', 'cautions',
        'need_more_info'
      ]
    };

    const instructions = [
      'Você é um assistente técnico para profissionais de higienização de estofados no Brasil.',
      'Analise a foto e as observações. Diferencie o que é visível do que é apenas hipótese. Foto não confirma com certeza a composição de um tecido nem a causa química de uma mancha.',
      'Use somente os produtos do catálogo enviado. Recomende no máximo três produtos e somente quando as superfícies, o método e a segurança cadastrados forem compatíveis. O nome recomendado deve corresponder exatamente ao nome de um produto do catálogo. Se nenhum for claramente adequado, devolva uma lista vazia.',
      'Nunca invente diluições, tempos de ação, propriedades químicas ou alegações de desinfecção. Se citar uma diluição, ela deve existir literalmente nos dados de diluição do produto enviado. Não recomende misturar produtos químicos.',
      'Dê passos curtos e práticos. Inclua teste em área discreta quando houver incerteza de tecido ou cor. Não recomende aplicar produto em couro, seda, lã, linho ou outro material se a ficha do produto não autorizar.',
      'Se a imagem não permitir conclusão, use confiança indeterminada/baixa e diga qual informação ou teste simples falta. Não afirme diagnóstico definitivo nem garanta remoção da mancha.',
      'Responda em português brasileiro, sem mandar o profissional procurar outro documento. Se uma informação essencial não existir no catálogo, diga explicitamente que não há dado confirmado e não improvise.',
      'Retorne exclusivamente um objeto JSON válido, sem markdown, sem cercas de código e sem texto antes ou depois. O objeto deve conter exatamente estas propriedades: ' + JSON.stringify(schema.properties)
    ].join(' ');

    const inputText = [
      instructions,
      'Material informado pelo profissional: ' + fabric,
      'Mancha/odor informado: ' + stain,
      'Observações: ' + (notes || 'nenhuma'),
      'Catálogo disponível (use somente estes produtos e os dados cadastrados):',
      JSON.stringify(products)
    ].join('\n\n');

    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: inputText },
            { inline_data: { mime_type: mimeType, data: imageBase64 } }
          ]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 4096,
          responseJsonSchema: schema
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data && data.error && data.error.message;
      const providerStatus = data && data.error && data.error.status;
      // Não registrar chave nem URL de requisição. Detalhes úteis, sem credenciais, ajudam no diagnóstico.
      console.error('Gemini visual assessment failed:', response.status, providerStatus || 'API_ERROR', message || 'API error');
      let detail = 'Erro HTTP ' + response.status;
      if (response.status === 400) detail = 'O Google rejeitou os parâmetros enviados (HTTP 400).';
      else if (response.status === 401 || response.status === 403) detail = 'O Google recusou a chave ou as permissões (HTTP ' + response.status + ').';
      else if (response.status === 404) detail = 'O modelo Gemini solicitado não foi encontrado ou não está disponível para esta chave (HTTP 404).';
      else if (response.status === 429) detail = 'A cota ou o limite de uso da API Gemini foi atingido (HTTP 429).';
      else if (response.status >= 500) detail = 'O serviço do Google Gemini apresentou uma falha temporária (HTTP ' + response.status + ').';
      return res.status(502).json({
        code: 'GEMINI_API_ERROR',
        error: 'A análise não foi concluída. ' + detail + (providerStatus ? ' Código: ' + String(providerStatus).slice(0, 80) + '.' : '')
      });
    }

    const candidate = Array.isArray(data.candidates) ? data.candidates[0] : null;
    const outputText = candidate && candidate.content && Array.isArray(candidate.content.parts)
      ? candidate.content.parts.map((part) => typeof part.text === 'string' ? part.text : '').join('').trim()
      : '';
    if (!outputText) {
      const reason = candidate && candidate.finishReason ? String(candidate.finishReason) : 'SEM_RESPOSTA';
      console.error('Gemini returned no text for visual assessment:', reason, data.promptFeedback && data.promptFeedback.blockReason || 'no_block_reason');
      return res.status(502).json({
        code: 'AI_EMPTY_RESPONSE',
        error: reason === 'MAX_TOKENS'
          ? 'A análise ficou incompleta. Reduza o tamanho da foto e tente novamente.'
          : 'A IA recebeu a foto, mas não gerou um relatório. Tente novamente.'
      });
    }
    let result;
    try {
      result = JSON.parse(outputText.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, ''));
    } catch {
      const reason = candidate && candidate.finishReason ? String(candidate.finishReason) : 'UNKNOWN';
      console.error('Gemini returned invalid JSON for visual assessment:', reason, 'characters:', outputText.length);
      return res.status(502).json({
        code: 'AI_INVALID_RESPONSE',
        error: reason === 'MAX_TOKENS'
          ? 'A resposta da IA ficou longa demais e foi interrompida. Tente novamente.'
          : 'A IA respondeu em formato incompleto. Tente novamente.'
      });
    }
    const requiredFields = ['summary', 'fabric_guess', 'fabric_confidence', 'stain_guess', 'stain_confidence', 'soil_level', 'visible_signs', 'recommended_products', 'steps', 'avoid', 'cautions', 'need_more_info'];
    const missingFields = requiredFields.filter((key) => !(key in result));
    if (missingFields.length) {
      console.error('Gemini assessment missing fields:', missingFields.join(', '));
      return res.status(502).json({ code: 'AI_INCOMPLETE_RESPONSE', error: 'A IA gerou um relatório incompleto. Tente novamente.' });
    }
    for (const key of ['visible_signs', 'recommended_products', 'steps', 'avoid', 'cautions', 'need_more_info']) {
      if (!Array.isArray(result[key])) result[key] = [];
    }
    for (const key of ['summary', 'fabric_guess', 'fabric_confidence', 'stain_guess', 'stain_confidence', 'soil_level']) {
      result[key] = clean(result[key], 500);
    }
    if (!result.summary || !result.fabric_guess || !result.stain_guess || !result.steps.length) {
      console.error('Gemini assessment contains empty critical fields.');
      return res.status(502).json({ code: 'AI_EMPTY_REPORT', error: 'A IA não conseguiu montar um relatório útil para esta foto. Tente outra imagem mais nítida.' });
    }

    const catalogNames = new Set(products.map((p) => p.name.toLocaleLowerCase('pt-BR')));
    result.recommended_products = (Array.isArray(result.recommended_products) ? result.recommended_products : [])
      .filter((item) => item && catalogNames.has(clean(item.name, 100).toLocaleLowerCase('pt-BR')))
      .slice(0, 3)
      .map((item) => ({ name: clean(item.name, 100), reason: clean(item.reason, 350) }));

    return res.status(200).json({ result });
  } catch (error) {
    console.error('HigienizaPro analysis error:', error && error.message ? error.message : 'unknown');
    return res.status(500).json({ error: 'Ocorreu um erro ao analisar a foto. Tente novamente.' });
  }
};
