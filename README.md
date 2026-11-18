# Pigpenfan

Repositório de **exposição do código da arquitetura frontend** desenvolvido para o coletivo musical **Pigpenfan**. O projeto apresenta a implementação completa de uma plataforma de catálogo musical, perfis de artistas, players de áudio/vídeo com letras e links de outras plataformas, mostruário de produtos e galeria dinâmica de eventos com lightbox.

> **Nota de Exposição:** Este repositório tem finalidade de exibição técnica e portfólio de código. Foi publicado para demonstrar práticas de engenharia de software frontend nativo, estruturação de dados desacoplada e manipulação avançada de DOM sem a necessidade de frameworks ou dependências externas.

---

## 🛠️ Tecnologias e Ferramentas

O desenvolvimento priorizou o uso estrito de **Vanilla Web Standards**, eliminando a sobrecarga de bibliotecas pesadas e pipelines de build complexos:

- **HTML5 Semântico:**
  - Estrutura orientada a acessibilidade (`ARIA roles`, `aria-modal`, `aria-hidden`, `aria-selected`).
  - Marcação semântica limpa e otimizada para indexação e navegabilidade.
- **CSS3 Modular e Responsivo:**
  - Arquitetura desacoplada em módulos (`base.css`, `components.css`, `home.css`, `artists.css`, `albums.css`).
  - Layouts fluidos desenvolvidos com **CSS Grid** e **Flexbox**.
  - Trilhas deslizantes com `scroll-snap` nativo e cálculo programático de rolagem.
  - Reset estrito de estilos e eliminação de transições e transformações redundantes para máxima estabilidade visual.
- **JavaScript ES6+ (Vanilla):**
  - **Single Source of Truth (`site-data.js`):** Catálogo centralizado em objeto imutável (`Object.freeze`) contendo 100% dos dados da aplicação (metadados, discografia, letras, streaming, produtos e imagens).
  - **Dynamic Render Engine (`render-engine.js`):** Motor próprio de manipulação do DOM, resolução dinâmica de caminhos relativos por profundidade (`getDepthPrefix`), ordenação dinâmica por datas ISO (`YYYY-MM-DD`) e controle de estado de interface.
  - **Event Delegation & Keyboard Handling:** Gerenciamento global de atalhos de teclado (`Escape`, `ArrowLeft`, `ArrowRight`) e bloqueio de rolagem do `body` durante abertura de modais.
- **Integrações e APIs Externas:**
  - **YouTube Embed API:** Incorporação de players e visualizers com controle de parâmetros de privacidade.
  - **Google Analytics 4 (GA4):** Módulo desacoplado de telemetria (`analytics.js`).
- **Otimização de Recursos e Performance:**
  - Ativos visuais compactados em formato **WebP** com alta fidelidade e peso reduzido.
  - Ícones de interface e plataformas desenvolvidos em vetores **SVG**.
  - Tipografias carregadas localmente via `@font-face` (eliminando dependência de CDNs externas).

---

## ⚙️ Arquitetura e Decisões Técnicas

### 1. Separação Estrita entre Dados e Visualização
A arquitetura foi estruturada para desacoplar completamente o conteúdo da camada de apresentação:
- O arquivo `site-data.js` atua como a base de dados estática centralizada do projeto.
- O arquivo `render-engine.js` consome esse catálogo e injeta dinamicamente os elementos no DOM, permitindo atualização ou expansão de conteúdo sem necessidade de intervir no HTML estrutural ou no CSS.

### 2. Resolução Dinâmica de Profundidade de Diretório (`getDepthPrefix`)
Para garantir que os mesmos componentes e scripts operem uniformemente em qualquer nível da árvore de arquivos (páginas na raiz, subdiretórios de 1º nível como `/sobre/` ou de 2º nível como `/artistas/peterc2/`), foi desenvolvido um algoritmo de cálculo de profundidade que gera dinamicamente os prefixos de caminhos relativos corretos (`./`, `../`, `../../`), prevenindo quebras de referências de mídia e links.

### 3. Componentes Interativos Nativos
- **Galeria com Seletor Dinâmico de Shows:**
  - Carrossel único com abas interativas para seleção de eventos (*Confraterniza Soul* &bull; 06/09/26 e *Feira Astral* &bull; 10/10/26).
  - Troca dinâmica de coleções de fotos no mesmo trilho, reinicialização de rolagem e sincronização do contador (`1 / N`).
- **Modal Lightbox Nativo:**
  - Visualização ampliada de fotos em tela cheia com navegação sequencial contínua (loop).
  - Operação completa via teclado (`Esc`, setas direcionais) e fechamento por backdrop.
- **Carrosséis com Trilha Deslizante (Vídeos e Merch):**
  - Implementação pura via `scrollBy({ behavior: 'smooth' })`, dispensando dependências externas de carrossel.
  - Sincronização entre miniaturas e reprodutor principal.

---

## 👥 Artistas e Projetos Catalogados

O ecossistema musical do coletivo inclui páginas de perfil dedicadas, contatos e catálogo de lançamentos:

- **Peterc2:** Guitarra, Vocais & Produção (*Desert Sample*, *The Ocean Trench*, *The Rescue Of The Cosmic Metaphysical Engineers*).
- **JC Dive:** Guitarra e Vocais (*Desert Sample*, *The Ocean Trench*).
- **Littering:** Banda de rock alternativo / indie (*Out Of Style*).
- **Pietrawrr (Pietra):** Vocal, Guitarra & Noise (*Harsh Noise To Jerk Off*, *O Sonho da Razão Produz Monstros*, *young man found with a cut...*, *sudo rm -rf my maleness*).

---

## 📂 Estrutura de Diretórios

```text
Site-Peterc2/
├── index.html                   # Página principal (destaques, vídeos, lançamentos, merch)
├── sobre/
│   └── index.html               # Página Sobre (biografia e galeria de fotos com seletor e lightbox)
├── artistas/
│   └── index.html               # Template dinâmico de artistas (?id=peterc2, ?id=pietrawrr, etc.)
├── projetos/
│   ├── index.html               # Template dinâmico de lançamentos/álbuns (?id=out-of-style, etc.)
│   └── musicas/
│       └── index.html           # Template dinâmico do player de faixas e letras (?album=...&track=...)
├── content/
│   ├── releases.json            # Catálogo unificado lido pelo navegador via fetch
│   └── projetos/                # Arquivos individuais de lançamentos (.json por álbum)
│       ├── _modelo-exemplo.json # Modelo para novos lançamentos
│       ├── desert-sample.json
│       ├── the-ocean-trench.json
│       ├── rescue-cosmic.json
│       ├── out-of-style.json
│       ├── harsh-noise-to-jerk-off.json
│       ├── o-sonho-da-razao-produz-monstros.json
│       ├── young-man-found-with-a-cut.json
│       └── sudo-rm-rf-my-maleness.json
├── scripts/
│   └── build.py                 # Compilador (content/projetos/*.json -> content/releases.json)
├── build.bat                    # Script Windows para compilar releases.json com 2 cliques
├── server.bat                   # Servidor local para testes no navegador (http://localhost:8000)
├── netlify.toml                 # Configuração de build automático e cache imutável no Netlify
├── assets/
│   ├── css/
│   │   ├── style.css            # Folha de estilo mestra e resets
│   │   └── modules/             # CSS modular (base, components, home, artists, albums)
│   ├── js/
│   │   ├── site-data.js         # Configurações gerais, artistas, vídeos e merch (sem dados duplicados)
│   │   ├── render-engine.js     # Motor de renderização dinâmico (carrega releases.json via fetch)
│   │   └── analytics.js         # Integração com GA4
│   ├── fonts/                   # Tipografia local (@font-face)
│   └── imagens/                 # Recursos visuais (.webp e .svg)
└── README.md                    # Documentação técnica do projeto
```

---

## 📊 Modelo de Dados (`site-data.js`)

A estrutura de dados é declarativa e organizada por entidades. Exemplo da modelagem das galerias de shows:

```javascript
aboutGalleries: [
  {
    id: "confraterniza-soul",
    title: "Confraterniza Soul",
    date: "2026-09-06",
    formattedDate: "06/09/26",
    photos: [
      "assets/imagens/sobre/confraterniza-soul/sobre-01.webp",
      // ...
    ]
  },
  {
    id: "feira-astral",
    title: "Feira Astral",
    date: "2026-10-10",
    formattedDate: "10/10/26",
    photos: [
      "assets/imagens/sobre/feira-astral/sobre-01.webp",
      // ...
    ]
  }
]
```

---

## 🎯 Destaques de Engenharia

| Aspecto | Implementação | Benefício |
|---|---|---|
| **Dependências** | Zero (100% Vanilla Web Standards) | Carregamento imediato, sem risco de quebras por bibliotecas externas |
| **Arquitetura** | Separação estrita de Dados e DOM | Facilidade de manutenção e escalabilidade sem refatoração de templates |
| **Performance** | WebP + SVGs + Fontes Locais | Baixo consumo de dados e carregamento de página ultra-rápido |
| **Acessibilidade** | ARIA Roles + Keyboard Navigation | Total navegabilidade via teclado em carrosséis e modais |
| **Portabilidade** | Resolução dinâmica de caminhos relativos | Resiliência em qualquer servidor estático ou subdiretório de hospedagem |
