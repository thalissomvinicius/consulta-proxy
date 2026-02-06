## consulta-proxy

Proxy HTTP->HTTPS para consumir a API externa em `http://177.221.240.85:8000` a partir do navegador.

### Rotas

- `GET /api/consulta/:codigo`

### Deploy (Vercel via rewrites)

1. Importar este repositório na Vercel
2. Deploy
3. Testar: `https://SEU-PROJETO.vercel.app/api/consulta/600?t=1`

### Alternativa 100% grátis (proxy local + Cloudflare Tunnel)

Use quando a API externa bloqueia data centers (Render/Vercel/etc). O proxy roda no seu PC/rede interna (onde a API funciona) e você publica um HTTPS.

1. No Windows, instale dependências:
   - `py -m pip install -r requirements.txt`
2. Rode o proxy local:
   - `py local_proxy.py`
   - Teste: `http://localhost:8787/api/consulta/600?t=1`
3. Instale o cloudflared e rode o tunnel:
   - `cloudflared tunnel --url http://localhost:8787`
4. Copie a URL https gerada (ex.: `https://xxxx.trycloudflare.com`) e use no Cloudflare Pages:
   - `VITE_CONSULTA_BASE=https://xxxx.trycloudflare.com`
