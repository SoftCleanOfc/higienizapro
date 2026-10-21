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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      code: 'AI_NOT_CONFIGURED',
      error: 'A análise por IA ainda não está habilitada no servidor. Falta configurar OPENAI_API_KEY nas variáveis de ambiente do projeto Vercel.'
    });
  }

  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image : '';
    if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 3500000) {
      return res.status(400).json({ error: 'A imagem não é válida ou ficou grande demais. Escolha uma foto mais leve.' });
    }

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
      'Responda em português brasileiro, sem mandar o profissional procurar outro documento. Se uma informação essencial não existir no catálogo, diga explicitamente que não há dado confirmado e não improvise.'
    ].join(' ');

    const inputText = [
      'Material informado pelo profissional: ' + fabric,
      'Mancha/odor informado: ' + stain,
      'Observações: ' + (notes || 'nenhuma'),
      'Catálogo disponível (use somente estes produtos e os dados cadastrados):',
      JSON.stringify(products)
    ].join('\n\n');

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        store: false,
        max_output_tokens: 1300,
        instructions,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: inputText },
            { type: 'input_image', image_url: image, detail: 'high' }
          ]
        }],
        text: {
          format: {
            type: 'json_schema',
            name: 'higienizapro_visual_assessment',
            strict: true,
            schema
          }
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data && data.error && data.error.message;
      console.error('OpenAI visual assessment failed:', response.status, message || 'API error');
      return res.status(502).json({
        error: 'Não foi possível concluir a análise por IA agora. Confira a configuração do serviço e tente novamente.'
      });
    }

    const outputText = data.output_text || (Array.isArray(data.output) ? data.output.flatMap((item) => Array.isArray(item.content) ? item.content : []).filter((item) => item.type === 'output_text').map((item) => item.text || '').join('') : '');
    let result;
    try {
      result = JSON.parse(outputText);
    } catch {
      return res.status(502).json({ error: 'A IA retornou um relatório inválido. Tente novamente.' });
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
