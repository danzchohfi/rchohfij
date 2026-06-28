# RCJ — R. Chohfi Junior · Consultoria em Engenharia

Site institucional estático (one-page) da **RCJ — R. Chohfi Junior, Consultoria em Engenharia**.
Consultoria técnica B2B: apoio à decisão técnica em projetos, planejamento, execução
e desempenho de empreendimentos de infraestrutura e mobilidade urbana de alta complexidade.

> **Decisões confiáveis. Excelência nos resultados.**

## Direção

Estética de engenharia sóbria e premium — azul-marinho profundo, dourado/champanhe
e creme. Tipografia serifada elegante (títulos) + grotesk/mono (corpo e dados técnicos).
Motivo visual recorrente: **ponte em treliça** (blueprint estrutural).

## Stack (sem build)

Site 100% estático, sem etapa de build. Aprimoramento progressivo com *fallback* completo:

- **CSS** — design system, grid rigoroso, motivos de blueprint.
- **GSAP + ScrollTrigger** — reveals por grid, stroke-draw das plantas, contadores.
- **Lenis** — smooth scroll.
- **Three.js (WebGL)** — treliça 3D no hero que se monta linha a linha, gira suavemente
  e reage ao cursor/scroll. Sem WebGL → ilustração SVG da treliça (fallback automático).

Fontes (Fraunces, Inter, IBM Plex Mono) e bibliotecas são **auto-hospedadas** em `assets/`
— nenhuma dependência de CDN em runtime.

### Acessibilidade e performance

- Mobile-first e responsivo.
- `prefers-reduced-motion` totalmente honrado (sem WebGL, sem preloader, sem parallax).
- Fontes com `preload` + `font-display:swap`; LCP é o título (texto), não o canvas.
- Sem analytics, sem Pixel/GA, sem formulário, sem captação de lead.

## Contato

Somente WhatsApp — botão flutuante + CTAs no hero e no rodapé, com mensagem pré-preenchida.

## Estrutura

```
index.html
assets/
  css/style.css
  js/main.js              # motion engine (módulo ES)
  js/vendor/              # gsap, scrolltrigger, lenis, three (auto-hospedados)
  fonts/                  # woff2 auto-hospedados (subset latin)
  img/                    # favicon.svg, og.svg
.nojekyll  robots.txt
```

## Deploy

### GitHub Pages
1. *Settings → Pages → Branch* → selecione a branch e a pasta raiz (`/`).
2. O arquivo `.nojekyll` já está presente (evita o processamento Jekyll).

### Vercel
*Import Project* → framework **Other** → output dir = raiz. Sem comando de build.

### Domínio + HTTPS
Adicione um arquivo `CNAME` na raiz com o domínio (ex.: `rcj.eng.br`) e aponte o DNS.
O HTTPS é provisionado automaticamente pelo GitHub Pages / Vercel.

---

© R. Chohfi Junior · Consultoria em Engenharia
