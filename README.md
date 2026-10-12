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

## Galeria de aplicativos

A seção **Galeria** (`#galeria`, menu "Galeria") reúne os aplicativos que a RCJ está
desenvolvendo. Os cards ficam direto no `index.html`, dentro de `<div class="gallery">`.

Para adicionar um aplicativo:

1. Copie o modelo comentado logo acima de `.gallery` no `index.html`.
2. Cole-o dentro de `.gallery`, no lugar de um card "Em breve" (`app-card--soon`).
3. Ajuste link, categoria (`app-card__tag`), nome, descrição e status
   (`app-card__status--live` = "No ar"; sem o modificador = "Em breve").
4. Imagem opcional, proporção 16:10, em `assets/img/galeria/`. Sem imagem, mantenha
   o `<svg>` de blueprint dos cards "Em breve".

A grade se ajusta sozinha (1 / 2 / 3 colunas), com qualquer quantidade de cards.

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
Publicado pelo workflow `.github/workflows/deploy.yml` a cada push na branch
(ou manualmente em *Actions → Deploy site to GitHub Pages → Run workflow*).
Em *Settings → Pages → Build and deployment*, a origem deve ser **GitHub Actions**.
O arquivo `.nojekyll` já está presente (evita o processamento Jekyll).

### Vercel
*Import Project* → framework **Other** → output dir = raiz. Sem comando de build.

### Domínio + HTTPS (rchohfij.com.br)
Com deploy via GitHub Actions **não se usa arquivo `CNAME`** (o GitHub o ignora): o domínio
é definido só em *Settings → Pages → Custom domain*.

DNS no registro.br (*Configurar zona DNS*, modo avançado):

| Tipo  | Nome           | Valor                       |
|-------|----------------|-----------------------------|
| A     | *(em branco)*  | `185.199.108.153`           |
| A     | *(em branco)*  | `185.199.109.153`           |
| A     | *(em branco)*  | `185.199.110.153`           |
| A     | *(em branco)*  | `185.199.111.153`           |
| CNAME | `www`          | `danzchohfi.github.io`      |

Depois que o DNS propagar, marque *Enforce HTTPS* em *Settings → Pages*
(o certificado é emitido automaticamente e pode levar até 24 h).

---

© R. Chohfi Junior · Consultoria em Engenharia
