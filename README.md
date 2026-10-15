# Chama SOS | front-end

Front-end do Chama SOS, em HTML, CSS e JavaScript. Publicado em https://chama-sos-frontend.vercel.app

As páginas estão em `chamasos-front/`: início, login, cadastro, dashboard, ocorrências, nova ocorrência, perfil, usuários e configurações. Há `manifest.json` e `service-worker.js`.

## Como abrir

Na pasta `chamasos-front`, porque o service worker usa caminho absoluto:

```bash
cd chamasos-front
python3 -m http.server 8000
```

Abra http://localhost:8000
