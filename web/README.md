# HigienizaPro — PWA

Aplicativo web instalável para profissionais de higienização de estofados. A interface reúne catálogo de produtos, fichas de aplicação e segurança, calculadora de diluição, avaliação visual, registros locais e comparador de fotos.

## Estrutura

- `index.html`: interface e lógica do app.
- `manifest.webmanifest`, `sw.js`, `icon.svg`: instalação PWA e atualização de recursos.
- `api/analyze.js`: endpoint de análise visual por IA. A chave da API fica somente no servidor, nunca no navegador.
- `vercel.json`: cabeçalhos de cache.

## Ativar a análise visual por IA na Vercel

1. Abra o projeto Vercel ligado a este repositório e confirme que o diretório raiz do projeto é `web`.
2. Em **Settings → Environment Variables**, crie `OPENAI_API_KEY` com uma chave válida da API OpenAI. Não coloque a chave no `index.html`, no GitHub ou em variáveis públicas `NEXT_PUBLIC_*`.
3. Opcionalmente, crie `OPENAI_MODEL` com um modelo compatível com a API Responses e análise de imagens. O padrão do endpoint é `gpt-4.1-mini`.
4. Marque o ambiente em que o app será usado (Production e, se necessário, Preview) e faça um novo deploy.
5. Teste o scanner com uma foto não sensível. Sem `OPENAI_API_KEY`, o endpoint retorna uma mensagem de configuração pendente e não simula uma análise.

A análise comprime a foto no navegador, envia a imagem e as observações para o endpoint do próprio app e usa a API OpenAI no servidor com `store: false`. A análise visual é uma estimativa, não uma confirmação de composição do tecido ou da causa química da mancha. As recomendações de produto são limitadas ao catálogo enviado pelo app e os dados de diluição são apresentados a partir da ficha cadastrada, não gerados pela IA.

## Abrir localmente

Sirva a pasta `web` por um servidor local. A instalação PWA depende de HTTPS ou de `localhost`. Para testar a IA localmente, configure `OPENAI_API_KEY` no ambiente do servidor que executa a função; abrir apenas o arquivo HTML não executa `/api/analyze`.

## Limitações atuais

- O catálogo e os registros locais funcionam no navegador, mas os registros não sincronizam entre aparelhos e não há autenticação nem banco de dados em nuvem.
- A análise por IA depende de configurar uma chave de API e confirmar que a função está publicada na Vercel.
- Ainda é necessário testar visualmente o app publicado em celular e desktop, verificar o carregamento de todas as imagens e testar a resposta da função de IA com uma chave válida.
- Confirme o tecido e faça teste em área discreta antes de aplicar produtos; não use a análise visual como garantia de resultado.
