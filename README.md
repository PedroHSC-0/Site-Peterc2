# Pigpenfan

Repositório de **exposição do código da arquitetura frontend** desenvolvido para o coletivo musical **Pigpenfan**. O projeto apresenta a implementação completa de uma plataforma de catálogo musical, perfis de artistas, players de áudio/vídeo com letras e links de outras plataformas, mostruário de produtos e galeria dinâmica de eventos com lightbox.

## Tecnologias

- HTML5, CSS3 e JavaScript puro, sem frameworks ou dependências externas no navegador.
- CSS organizado em módulos dentro de `assets/css/modules/` (`fonts.css`, `base.css`, `components.css`, `home.css`, `artists.css`, `albums.css`, `overrides.css`) e compilado em um único `assets/css/style.css` (sem `@import`).
- Fontes locais em `.woff2` com `font-display: swap`, imagens em `.webp` e ícones em `.svg`.
- PWA básico com `manifest.webmanifest` e Service Worker (`sw.js`).
- Google Analytics 4 em `assets/js/analytics.js`, usando delegação de eventos para registrar cliques em artistas, álbuns, merch, faixas, contatos e links de streaming, mantendo as query strings no `page_path`.
- Players de vídeo e faixas incorporados via YouTube Embed.

## Como funciona

- **Conteúdo separado do layout:** artistas, lançamentos, vídeos, merch, textos e configurações ficam em arquivos `.json` dentro de `content/`.
- **Compilação (`scripts/build.py`):** lê os arquivos de `content/`, normaliza datas, subtítulos, links, slugs das faixas e datas herdadas nos vídeos em Python, e gera `content/data.json` e `assets/js/site-data.js` (permitindo rodar tanto em `http://` quanto abrindo o HTML direto via `file://`). O mesmo script concatena os módulos CSS em `assets/css/style.css`.
- **Páginas dinâmicas:** `artistas/index.html?id=...`, `projetos/index.html?id=...` e `projetos/musicas/index.html?album=...&track=...` são preenchidas pelo `assets/js/render-engine.js`, que também resolve caminhos relativos conforme o nível da pasta (`getDepthPrefix`).
- **Galeria da página Sobre:** `sobre/index.html` agrupa as fotos por show (*Confraterniza Soul*, *Feira Astral* e *Halloween Olimpo*) em um carrossel horizontal com modal lightbox e navegação por teclado (`Esc`, `←`, `→`).
- **Deploy e CI:** o `netlify.toml` executa `python3 scripts/build.py` e define as regras de cache; o workflow `.github/workflows/build-content.yml` recompila e commita `content/data.json`, `assets/js/site-data.js` e `assets/css/style.css` quando há alterações em `content/`, `assets/css/modules/` ou `scripts/build.py`.

## Artistas e lançamentos

- **Peterc2:** Guitarra, Vocais e Produção (*Desert Sample*, *The Ocean Trench*, *The Rescue Of The Cosmic Metaphysical Engineers*).
- **JC Dive:** Guitarra e Vocais (*Desert Sample*, *The Ocean Trench*).
- **Littering:** Banda de rock alternativo / indie (*Out Of Style*).
- **Pietrawrr (Pietra):** Vocal, Guitarra e Noise (*Harsh Noise To Jerk Off*, *O Sonho da Razão Produz Monstros*, *young man found with a cut...*, *sudo rm -rf my maleness*).

## Estrutura de pastas

```text
Site-Peterc2/
├── index.html
├── sobre/
│   └── index.html
├── artistas/
│   └── index.html
├── projetos/
│   ├── index.html
│   └── musicas/
│       └── index.html
├── content/
│   ├── config.json
│   ├── data.json
│   ├── merch.json
│   ├── sobre.json
│   ├── videos.json
│   ├── artistas/
│   │   ├── _modelo-exemplo.json
│   │   ├── jcdive.json
│   │   ├── littering.json
│   │   ├── peterc2.json
│   │   └── pietrawrr.json
│   └── projetos/
│       ├── _modelo-exemplo.json
│       ├── desert-sample.json
│       ├── harsh-noise-to-jerk-off.json
│       ├── o-sonho-da-razao-produz-monstros.json
│       ├── out-of-style.json
│       ├── rescue-cosmic.json
│       ├── sudo-rm-rf-my-maleness.json
│       ├── the-ocean-trench.json
│       └── young-man-found-with-a-cut.json
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── modules/
│   │       ├── fonts.css
│   │       ├── base.css
│   │       ├── components.css
│   │       ├── home.css
│   │       ├── artists.css
│   │       ├── albums.css
│   │       └── overrides.css
│   ├── js/
│   │   ├── site-data.js
│   │   ├── render-engine.js
│   │   └── analytics.js
│   ├── fonts/
│   └── imagens/
├── scripts/
│   ├── build.py
│   └── optimize_images.py
├── .github/
│   └── workflows/
│       └── build-content.yml
├── build.bat
├── sw.js
├── manifest.webmanifest
├── netlify.toml
├── .gitignore
├── LICENSE
└── README.md
```

## Licença

- **Código-fonte** (`HTML`, `CSS`, `JS`, scripts Python e arquivos de configuração): licenciado sob a licença **MIT** em [LICENSE](LICENSE).
- **Conteúdo artístico e mídia** (`content/` e `assets/imagens/` — músicas, letras, capas, logotipos, biografias e fotos de shows): **todos os direitos reservados** a Pedro Henrique Silva Costa e aos artistas do coletivo Pigpenfan.
- **Fontes** (`assets/fonts/`): seguem as licenças originais dos respectivos autores, descritas nos arquivos `.txt` de cada pasta.
