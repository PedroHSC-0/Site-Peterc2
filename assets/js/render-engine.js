/**
 * MOTOR DE RENDERIZAÇÃO AUTOMÁTICA DO SITE (RENDER ENGINE)
 * 
 * Lê centralizadamente os dados de SITE_DATA e garante a renderização
 * 100% dinâmica de todas as páginas do site:
 * 1. Seção de Vídeos em Destaque (no topo da home).
 * 2. Lançamentos Recentes & Colaborações.
 * 3. Páginas dos Artistas (integrantes, fotos, lançamentos e contatos).
 * 4. Páginas dos Álbuns e Singulados (capa, créditos, streaming e tracklist).
 * 5. Player de Música (reprodutor de vídeo/foto, letras, créditos e navegação).
 * 6. Gerenciamento e aplicação de plano de fundo dinâmico e responsivo.
 */

(function () {

  // =========================================================
  // AUXILIARES DE CAMINHO, DATA E SELEÇÃO DE ENTIDADES
  // =========================================================

  /**
   * Ordena coleções de objetos por releaseDate.
   */
  function sortItemsByDate(items, order = 'desc', fallback = '9999-12-31') {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      const dateA = new Date(a.releaseDate || fallback);
      const dateB = new Date(b.releaseDate || fallback);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Formata datas ISO (YYYY-MM-DD) para exibição brasileira (DD/MM/YYYY).
   */
  function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
  }

  /**
   * Determina o prefixo relativo (ex: '../../') baseado na profundidade da URL atual.
   */
  function getDepthPrefix() {
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.replace(/\\/g, '/') : '';
    if (/\/projetos\/[^/]+\/musicas\//i.test(path)) return '../../../';
    if (path.includes('/projetos/musicas/')) return '../../';
    if (path.includes('/musicas/')) return '../../../';
    if (/\/projetos\/(index\.html)?$/i.test(path) || path.endsWith('/projetos') || path.endsWith('/projetos/')) return '../';
    if (/\/artistas\/(index\.html)?$/i.test(path) || path.endsWith('/artistas') || path.endsWith('/artistas/')) return '../';
    if (path.includes('/artistas/') || path.includes('/projetos/')) return '../../';
    if (path.includes('/sobre/')) return '../';
    return '';
  }

  /**
   * Ajusta URLs relativas internas de acordo com a profundidade da página atual.
   */
  function resolveRelativePath(url) {
    if (!url || url.startsWith('http') || url.startsWith('/') || url.startsWith('.')) {
      return url || '';
    }
    return getDepthPrefix() + url;
  }

  /**
   * Auxiliar para definir ou atualizar uma metatag no <head>.
   */
  function setMetaTag(attrName, attrVal, content) {
    if (!content || typeof document === 'undefined') return;
    let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrVal);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  /**
   * Atualiza dinamicamente as metatags de SEO, Open Graph e Twitter Cards da página.
   */
  function updatePageMeta({ title, description, image, type = 'website' } = {}) {
    if (typeof document === 'undefined') return;

    if (title) {
      document.title = title;
      setMetaTag('property', 'og:title', title);
      setMetaTag('name', 'twitter:title', title);
    }
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }
    if (image) {
      let fullImageUrl = image;
      try {
        if (typeof location !== 'undefined' && !image.startsWith('http://') && !image.startsWith('https://')) {
          fullImageUrl = new URL(image, location.href).href;
        }
      } catch (e) {}
      setMetaTag('property', 'og:image', fullImageUrl);
      setMetaTag('name', 'twitter:image', fullImageUrl);
    }
    if (type) {
      setMetaTag('property', 'og:type', type);
    }
    if (typeof location !== 'undefined') {
      setMetaTag('property', 'og:url', location.href);
    }
  }

  /**
   * Identifica a chave do artista atual a partir da classe do body ou pathname.
   */
  function getCurrentArtistKey() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return null;
    const b = typeof document !== 'undefined' ? document.body : null;
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';

    if (typeof location !== 'undefined' && location.search) {
      const params = new URLSearchParams(location.search);
      const artistParam = params.get('artist') || params.get('artista') || params.get('id');
      if (artistParam) {
        const lowerParam = artistParam.toLowerCase();
        for (const key of Object.keys(SITE_DATA.artists)) {
          if (key.toLowerCase() === lowerParam) return key;
        }
      }
    }

    for (const key of Object.keys(SITE_DATA.artists)) {
      if ((b && b.classList.contains(`artist-${key}`)) || path.includes(`/artistas/${key}`) || path.includes(`/${key}/`) || path.endsWith(`/${key}`)) {
        return key;
      }
    }

    if (/\/artistas\/(index\.html)?$/i.test(path) || path.endsWith('/artistas') || path.endsWith('/artistas/')) {
      return Object.keys(SITE_DATA.artists)[0] || null;
    }

    return null;
  }

  /**
   * Identifica o objeto do álbum/single atual a partir da classe do body ou pathname.
   */
  function getCurrentAlbum() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return null;
    const b = typeof document !== 'undefined' ? document.body : null;
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';

    if (typeof location !== 'undefined' && location.search) {
      const params = new URLSearchParams(location.search);
      const albumParam = params.get('album') || params.get('id') || params.get('projeto');
      if (albumParam) {
        const found = SITE_DATA.albums.find(a => a.id === albumParam || a.id.toLowerCase() === albumParam.toLowerCase());
        if (found) return found;
      }
    }

    return SITE_DATA.albums.find(album => {
      if (path.includes(album.id) || (b && b.classList.contains(album.id))) return true;
      if (album.link) {
        const folder = album.link.split('/')[1];
        if (folder && path.includes(folder)) return true;
      }
      if (b && album.id === 'the-ocean-trench' && b.classList.contains('ocean-trench')) return true;
      return false;
    }) || null;
  }

  // =========================================================
  // CONSULTAS DE DADOS
  // =========================================================

  function getSortedVideos(order = 'desc') {
    return sortItemsByDate(SITE_DATA?.videos, order, '1970-01-01');
  }

  function getSortedAlbums(order = 'desc') {
    return sortItemsByDate(SITE_DATA?.albums, order, '9999-12-31');
  }

  function getRecentReleases(limit = 4) {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return [];
    const maxItems = typeof limit === 'number' && limit > 0 ? limit : 4;
    return getSortedAlbums('desc').slice(0, maxItems);
  }

  const DEFAULT_CONTACT_INFO = {
    instagram: { label: "Instagram", icon: "assets/imagens/icones/instagram.svg" },
    youtube:   { label: "YouTube",   icon: "assets/imagens/icones/youtube.svg" },
    spotify:   { label: "Spotify",   icon: "assets/imagens/icones/spotify.svg" },
    apple:     { label: "Apple Music", icon: "assets/imagens/icones/apple.svg" },
    bandcamp:  { label: "Bandcamp",  icon: "assets/imagens/icones/bandcamp.svg" },
    bandcamp1: { label: "Bandcamp",  icon: "assets/imagens/icones/bandcamp.svg" },
    bandcamp2: { label: "Bandcamp",  icon: "assets/imagens/icones/bandcamp.svg" }
  };

  /**
   * Retorna a URL da página do artista (calculada dinamicamente a partir do id caso omitida).
   */
  function getArtistPage(artist) {
    if (!artist) return 'artistas/index.html';
    if (typeof artist === 'string') return `artistas/index.html?id=${encodeURIComponent(artist)}`;
    if (artist.page) return artist.page;
    const id = artist.id || '';
    return `artistas/index.html?id=${encodeURIComponent(id)}`;
  }

  /**
   * Retorna a URL da página do lançamento (calculada dinamicamente a partir do id caso omitida).
   */
  function getAlbumLink(album) {
    if (!album) return 'projetos/index.html';
    if (typeof album === 'string') return `projetos/index.html?id=${encodeURIComponent(album)}`;
    if (album.link) return album.link;
    return `projetos/index.html?id=${encodeURIComponent(album.id || '')}`;
  }

  /**
   * Renderiza os itens individuais de contato de um artista.
   */
  function renderContactItems(contacts, prefix = '') {
    if (!contacts) return '';
    return Object.entries(contacts).map(([key, item]) => {
      if (!item) return '';
      const fallback = DEFAULT_CONTACT_INFO[key] || {};
      const iconPath = prefix + (item.icon || fallback.icon || '');
      const label = item.label || fallback.label || key;
      const value = item.value || (item.url ? label : 'Em Breve');
      if (item.url) {
        return `
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="contact-item clickable">
            <img src="${iconPath}" alt="${label}" class="icon">
            <span class="label">${label}</span>
            <span class="value">${value}</span>
          </a>
        `;
      } else {
        return `
          <div class="contact-item placeholder">
            <img src="${iconPath}" alt="${label}" class="icon">
            <span class="label">${label}</span>
            <span class="value">${item.value || 'Em Breve'}</span>
          </div>
        `;
      }
    }).join('');
  }

  // =========================================================
  // 0. RENDERIZADOR PADRONIZADO DA BARRA DE NAVEGAÇÃO (TOP-NAV)
  // =========================================================

  function renderTopNav() {
    const navContainer = document.querySelector('.top-nav-container');
    if (!navContainer) return;

    const prefix = getDepthPrefix();
    const rawPath = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';
    const hasLocalContact = !!document.getElementById('contato');

    const isHome = !rawPath.includes('/artistas/') && !rawPath.includes('/projetos/') && !rawPath.includes('/sobre/');
    const isSobre = rawPath.includes('/sobre/');

    const homeUrl = prefix ? prefix + 'index.html' : 'index.html';
    const sobreUrl = prefix + 'sobre/index.html';
    const merchUrl = isHome ? '#merch' : (prefix + 'index.html#merch');
    const contatoUrl = hasLocalContact ? '#contato' : (prefix + 'index.html#contato');

    let artistsLinksHTML = '';
    const currentArtistKey = getCurrentArtistKey();
    if (typeof SITE_DATA !== 'undefined' && SITE_DATA.artists) {
      artistsLinksHTML = Object.values(SITE_DATA.artists).map(artist => {
        const artistUrl = prefix + getArtistPage(artist);
        const isActive = currentArtistKey === artist.id || rawPath.includes('/' + artist.id);
        return `<a href="${artistUrl}" class="${isActive ? 'active' : ''}">${artist.name.toUpperCase()}</a>`;
      }).join('\n        ');
    }

    navContainer.innerHTML = `
      <a href="${homeUrl}" class="top-nav-logo">PIGPENFAN</a>
      <nav class="top-nav-links">
        <a href="${homeUrl}" class="${isHome ? 'active' : ''}">INÍCIO</a>
        ${artistsLinksHTML}
        <a href="${merchUrl}">MERCH</a>
        <a href="${sobreUrl}" class="${isSobre ? 'active' : ''}">SOBRE</a>
        <a href="${contatoUrl}" class="nav-contact-btn">CONTATO</a>
      </nav>
    `;
  }

  // =========================================================
  // 1. RENDERIZADOR DA SEÇÃO DE VÍDEOS EM DESTAQUE (CAROUSEL)
  // =========================================================

  function renderFeaturedVideosSection() {
    const section = document.getElementById('featured-videos-section');
    if (!section || typeof SITE_DATA === 'undefined' || !SITE_DATA.videos || SITE_DATA.videos.length === 0) return;

    const videos = getSortedVideos('desc');
    let currentIdx = 0;

    function getEmbedUrl(rawYoutube) {
      const match = String(rawYoutube || '').match(/(?:youtu\.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*)/);
      const ytId = match ? match[1] : (rawYoutube || '');
      return `https://www.youtube.com/embed/${ytId}`;
    }

    function scrollActiveThumbIntoView() {
      const thumbsContainer = document.getElementById('video-carousel-thumbs');
      if (!thumbsContainer) return;
      const activeCard = thumbsContainer.children[currentIdx];
      if (!activeCard) return;

      const containerWidth = thumbsContainer.clientWidth;
      const cardLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const currentScroll = thumbsContainer.scrollLeft;

      if (cardLeft < currentScroll) {
        thumbsContainer.scrollTo({ left: cardLeft, behavior: 'smooth' });
      } else if (cardLeft + cardWidth > currentScroll + containerWidth) {
        thumbsContainer.scrollTo({ left: cardLeft + cardWidth - containerWidth, behavior: 'smooth' });
      }
    }

    function updateStage() {
      const video = videos[currentIdx];
      const videoEmbedUrl = getEmbedUrl(video.youtube);

      const iframe = document.getElementById('featured-video-iframe');
      if (iframe && iframe.src !== videoEmbedUrl) {
        iframe.src = videoEmbedUrl;
        iframe.title = video.title;
      }

      const counter = section.querySelector('.video-carousel-counter');
      if (counter) counter.textContent = `${currentIdx + 1} / ${videos.length}`;

      const titleEl = section.querySelector('.video-carousel-info-title');
      if (titleEl) titleEl.textContent = video.title;

      const metaEl = section.querySelector('.video-carousel-info-meta');
      if (metaEl) metaEl.textContent = `${video.artist} ${video.releaseDate ? '• Lançamento: ' + formatDateBR(video.releaseDate) : ''}`;

      const descEl = section.querySelector('.video-carousel-info-desc');
      if (descEl) {
        descEl.textContent = video.description || '';
        descEl.style.display = video.description ? 'block' : 'none';
      }

      const thumbCards = section.querySelectorAll('.video-carousel-thumb-card');
      thumbCards.forEach((card, idx) => {
        if (idx === currentIdx) {
          card.classList.add('active');
          card.setAttribute('aria-current', 'true');
        } else {
          card.classList.remove('active');
          card.removeAttribute('aria-current');
        }
      });

      scrollActiveThumbIntoView();
    }

    function buildCarousel() {
      const video = videos[currentIdx];
      const videoEmbedUrl = getEmbedUrl(video.youtube);

      const thumbsHTML = videos.map((v, i) => `
        <button 
          class="video-carousel-thumb-card ${i === currentIdx ? 'active' : ''}" 
          onclick="window.SiteEngine.switchFeaturedVideo(${i})"
          title="${v.title}"
          ${i === currentIdx ? 'aria-current="true"' : ''}
        >
          <img 
            src="${v.cover || 'assets/imagens/capas/placeholder.webp'}" 
            alt="${v.title}" 
            class="video-carousel-thumb-cover img-fade-in"
            loading="${i < 4 ? 'eager' : 'lazy'}"
            decoding="async"
            onload="this.classList.add('is-loaded')"
            onerror="this.classList.add('is-loaded')"
          >
          <span class="video-carousel-thumb-title">${v.title}</span>
          <span class="video-carousel-thumb-artist">${v.artist}</span>
        </button>
      `).join('');

      section.innerHTML = `
        <div class="video-carousel-container">
          <div class="video-carousel-header">
            <h2 class="video-carousel-title">Vídeos em Destaque</h2>
            <div class="video-carousel-controls">
              <span class="video-carousel-counter">${currentIdx + 1} / ${videos.length}</span>
              <button class="video-carousel-btn" onclick="window.SiteEngine.prevFeaturedVideo()" title="Anterior">‹</button>
              <button class="video-carousel-btn" onclick="window.SiteEngine.nextFeaturedVideo()" title="Próximo">›</button>
            </div>
          </div>
          
          <div class="video-carousel-stage">
            <div class="video-carousel-player-wrapper">
              <iframe
                id="featured-video-iframe"
                src="${videoEmbedUrl}"
                title="${video.title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen>
              </iframe>
            </div>

            <div class="video-carousel-info">
              <div class="video-carousel-info-title">${video.title}</div>
              <div class="video-carousel-info-meta">${video.artist} ${video.releaseDate ? '• Lançamento: ' + formatDateBR(video.releaseDate) : ''}</div>
              ${video.description ? `<div class="video-carousel-info-desc">${video.description}</div>` : ''}
            </div>

            <div class="video-carousel-thumbs-header">
              <span class="video-carousel-thumbs-label">TODOS OS VÍDEOS (${videos.length})</span>
              <div class="video-carousel-thumbs-nav" ${videos.length <= 4 ? 'style="display:none;"' : ''}>
                <button type="button" class="video-carousel-thumbs-btn" onclick="window.SiteEngine.scrollVideoThumbs(-1)" title="Rolar anteriores">‹</button>
                <button type="button" class="video-carousel-thumbs-btn" onclick="window.SiteEngine.scrollVideoThumbs(1)" title="Rolar próximos">›</button>
              </div>
            </div>

            <div class="video-carousel-thumbs" id="video-carousel-thumbs" tabindex="0" aria-label="Carrossel de vídeos">
              ${thumbsHTML}
            </div>
          </div>
        </div>
      `;
      section.style.display = 'block';
      scrollActiveThumbIntoView();
    }

    window.SiteEngine = window.SiteEngine || {};
    window.SiteEngine.switchFeaturedVideo = function(index) {
      if (index >= 0 && index < videos.length) {
        currentIdx = index;
        updateStage();
      }
    };

    window.SiteEngine.prevFeaturedVideo = function() {
      currentIdx = (currentIdx - 1 + videos.length) % videos.length;
      updateStage();
    };

    window.SiteEngine.nextFeaturedVideo = function() {
      currentIdx = (currentIdx + 1) % videos.length;
      updateStage();
    };

    window.SiteEngine.scrollVideoThumbs = function(direction) {
      const thumbsContainer = document.getElementById('video-carousel-thumbs');
      if (thumbsContainer) {
        const card = thumbsContainer.querySelector('.video-carousel-thumb-card');
        const step = card ? (card.offsetWidth + 10) : 220;
        thumbsContainer.scrollBy({ left: direction * step, behavior: 'smooth' });
      }
    };

    buildCarousel();
  }

  // =========================================================
  // 2. RENDERIZADOR DE LANÇAMENTOS RECENTES (HOME)
  // =========================================================

  function renderRecentReleasesSection() {
    const section = document.getElementById('recent-releases-section');
    const gallery = document.getElementById('recent-releases-gallery');
    if (!section || !gallery) return;

    const recentAlbums = getRecentReleases(4);
    if (recentAlbums.length === 0) {
      section.style.display = 'none';
      return;
    }

    gallery.innerHTML = recentAlbums.map((album, idx) => {
      const coverImg = resolveRelativePath(album.cover || 'assets/imagens/capas/placeholder.webp');
      const link = resolveRelativePath(getAlbumLink(album));
      const priority = idx < 4 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
      return `
        <a href="${link}" class="album-card" data-release-date="${album.releaseDate}">
          <img 
            src="${coverImg}" 
            alt="${album.title}" 
            class="album-card-cover img-fade-in"
            ${priority}
            decoding="async"
            onload="this.classList.add('is-loaded')"
            onerror="this.classList.add('is-loaded')"
          >
          <span class="album-card-title">${album.title}</span>
          <span class="album-card-sub">${album.subtitle}</span>
        </a>
      `;
    }).join('');

    section.style.display = 'block';
  }

  // =========================================================
  // 3. RENDERIZADORES DA PÁGINA INICIAL (HOME)
  // =========================================================

  function renderHomeArtists() {
    const gallery = document.getElementById('home-artists-gallery') || document.querySelector('.center > .artist-gallery');
    if (!gallery || typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return;
    const prefix = getDepthPrefix();
    gallery.innerHTML = Object.values(SITE_DATA.artists).map(artist => `
      <a href="${prefix}${getArtistPage(artist)}" class="artist-image-card">
        <img 
          src="${prefix}${artist.portrait || `assets/imagens/icones/${artist.id}-icon.webp`}" 
          alt="${artist.name}" 
          class="artist-portrait img-fade-in"
          loading="eager"
          decoding="async"
          onload="this.classList.add('is-loaded')"
          onerror="this.classList.add('is-loaded')"
        >
        <span class="artist-card-title">${artist.name}</span>
      </a>
    `).join('');
  }

  function renderHomeCollaborations() {
    const gallery = document.getElementById('collab-albums-gallery') || document.querySelector('.collab-section:not(#recent-releases-section):not(#featured-videos-section):not(#merch) .album-gallery');
    if (!gallery || typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return;
    const collabs = sortItemsByDate(
      SITE_DATA.albums.filter(album => album.type === 'Colaboração' || (album.artists && album.artists.length > 1)),
      'asc'
    );
    const prefix = getDepthPrefix();
    gallery.innerHTML = collabs.map(album => `
      <a href="${prefix}${getAlbumLink(album)}" class="album-card" data-release-date="${album.releaseDate}">
        <img 
          src="${prefix}${album.cover}" 
          alt="${album.title}" 
          class="album-card-cover img-fade-in"
          loading="lazy"
          decoding="async"
          onload="this.classList.add('is-loaded')"
          onerror="this.classList.add('is-loaded')"
        >
        <span class="album-card-title">${album.title}</span>
        <span class="album-card-sub">${album.subtitle}</span>
      </a>
    `).join('');
  }

  function renderHomeContacts() {
    const container = document.getElementById('home-contacts-container');
    if (!container || typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return;
    const prefix = getDepthPrefix();
    container.innerHTML = Object.values(SITE_DATA.artists).map(artist => `
      <div class="contact-group">
        <h3 class="contact-group-title">${artist.name}</h3>
        <div class="contact-list">
          ${renderContactItems(artist.contacts, prefix)}
        </div>
      </div>
    `).join('');
  }

  // =========================================================
  // 4. RENDERIZADOR DE ARTISTAS (PÁGINAS DE ARTISTAS)
  // =========================================================

  function renderArtistPage() {
    const artistKey = getCurrentArtistKey();
    if (!artistKey || typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return;

    const artist = SITE_DATA.artists[artistKey];
    if (!artist) return;

    const prefix = getDepthPrefix();

    // 1. Título e Metatags da página (SEO & Social Sharing)
    const metaTitle = `${artist.name} | Pigpenfan`;
    const metaDesc = artist.role 
      ? `${artist.name} (${artist.role}) no coletivo musical Pigpenfan. Discografia, lançamentos e contatos.`
      : `Perfil e lançamentos de ${artist.name} no coletivo musical Pigpenfan.`;
    const metaImg = artist.portrait ? prefix + artist.portrait : '';
    updatePageMeta({ title: metaTitle, description: metaDesc, image: metaImg, type: 'profile' });

    // 2. Classes do body para estilos CSS do artista
    if (typeof document !== 'undefined' && document.body) {
      for (const cls of Array.from(document.body.classList)) {
        if (cls.startsWith('artist-')) {
          document.body.classList.remove(cls);
        }
      }
      document.body.classList.add(`artist-${artistKey}`);
    }

    // 3. Favicon da aba
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && artist.portrait) {
      favicon.href = prefix + artist.portrait;
    }

    // 4. Imagem do artista
    const portraitImg = document.getElementById('artist-portrait-img') || document.querySelector('.center .artist-portrait');
    if (portraitImg) {
      portraitImg.classList.add('img-fade-in');
      portraitImg.classList.remove('is-loaded');
      portraitImg.onload = () => portraitImg.classList.add('is-loaded');
      portraitImg.onerror = () => portraitImg.classList.add('is-loaded');
      portraitImg.src = prefix + artist.portrait;
      portraitImg.alt = artist.name;
      if (portraitImg.complete) portraitImg.classList.add('is-loaded');
    }

    // 5. Nome do artista no topo
    const titleEl = document.getElementById('artist-name-title') || document.querySelector('.center > h1');
    if (titleEl) {
      titleEl.textContent = artist.name.toUpperCase();
    }

    // 6. Integrantes da banda (se houver)
    const membersBox = document.getElementById('artist-members-box') || document.querySelector('.members-box');
    if (membersBox) {
      if (artist.members && artist.members.length > 0) {
        membersBox.innerHTML = `
          <h2>INTEGRANTES</h2>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: #cccccc; line-height: 1.8;">
            ${artist.members.map(m => `<li><strong style="color: #ffffff;">${m.name}</strong> — ${m.role}</li>`).join('')}
          </ul>
        `;
        membersBox.style.display = 'block';
      } else {
        membersBox.style.display = 'none';
      }
    }

    // 7. Lançamentos do artista
    const gallery = document.getElementById('artist-albums-gallery') || document.querySelector('.artist-projects .album-gallery');
    if (gallery && SITE_DATA.albums) {
      const artistAlbums = sortItemsByDate(
        SITE_DATA.albums.filter(album => album.artists && album.artists.includes(artistKey)),
        'desc'
      );
      if (artistAlbums.length === 0) {
        gallery.innerHTML = '<p class="merch-notice" style="display:block; width:100%; text-align:center;">Em Breve</p>';
      } else {
        gallery.innerHTML = artistAlbums.map((album, idx) => `
          <a href="${prefix}${getAlbumLink(album)}" class="album-card" data-release-date="${album.releaseDate}">
            <img 
              src="${prefix}${album.cover}" 
              alt="${album.title}" 
              class="album-card-cover img-fade-in"
              loading="${idx < 4 ? 'eager' : 'lazy'}"
              decoding="async"
              onload="this.classList.add('is-loaded')"
              onerror="this.classList.add('is-loaded')"
            >
            <span class="album-card-title">${album.title}</span>
            <span class="album-card-sub">${album.subtitle}</span>
          </a>
        `).join('');
      }
    }

    // 8. Seção de contato do artista
    const contactHeader = document.getElementById('artist-contact-header') || document.querySelector('#contato .contacts-header');
    if (contactHeader) {
      contactHeader.textContent = `CONTATO - ${artist.name.toUpperCase()}`;
    }

    const contactList = document.getElementById('artist-contact-list') || document.querySelector('#contato .contact-list');
    if (contactList && artist.contacts) {
      contactList.innerHTML = renderContactItems(artist.contacts, prefix);
    }
  }

  // =========================================================
  // 5. RENDERIZADOR DE ÁLBUNS E SINGLES (PÁGINAS DE PROJETOS)
  // =========================================================

  function renderAlbumPage() {
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';
    if (path.includes('/musicas/')) return;

    const album = getCurrentAlbum();
    if (!album) return;

    const prefix = getDepthPrefix();

    // Metatags dinâmicas de SEO e Open Graph
    const metaTitle = `${album.title} - ${album.credit || 'Pigpenfan'}`;
    const metaDesc = (typeof album.message === 'string' && album.message.trim())
      ? `${album.title} (${album.type || 'Lançamento'}). ${album.message.substring(0, 150)}...`
      : `Ouça ${album.title} por ${album.credit || 'Pigpenfan'} no catálogo oficial Pigpenfan. Faixas, letras e links de streaming.`;
    const metaImg = album.cover ? prefix + album.cover : '';
    updatePageMeta({ title: metaTitle, description: metaDesc, image: metaImg, type: 'music.album' });

    if (typeof document !== 'undefined' && document.body && album.artists && album.artists.length > 0) {
      for (const cls of Array.from(document.body.classList)) {
        if (cls.startsWith('artist-')) document.body.classList.remove(cls);
      }
      document.body.classList.add(`artist-${album.artists[0]}`);
      document.body.classList.add(album.id);
    }

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && album.cover) {
      favicon.href = prefix + album.cover;
    }

    const coverImg = document.getElementById('album-cover-img') || document.querySelector('.album-detail-cover');
    if (coverImg) {
      coverImg.classList.add('img-fade-in');
      coverImg.classList.remove('is-loaded');
      coverImg.onload = () => coverImg.classList.add('is-loaded');
      coverImg.onerror = () => coverImg.classList.add('is-loaded');
      coverImg.src = prefix + (album.cover || 'assets/imagens/capas/placeholder.webp');
      coverImg.alt = album.title;
      if (coverImg.complete) coverImg.classList.add('is-loaded');
    }

    const titleEl = document.getElementById('album-title-el') || document.querySelector('.album-detail-title');
    if (titleEl) {
      titleEl.textContent = album.title;
    }

    const subEl = document.getElementById('album-sub-el') || document.querySelector('.album-detail-sub');
    if (subEl) {
      subEl.textContent = (album.credit || album.subtitle || '').toUpperCase();
    }

    const dateEl = document.getElementById('album-date-el') || document.querySelector('.album-detail-info .small-text');
    if (dateEl) {
      const dateText = album.formattedDate ? album.formattedDate : (album.releaseDate ? formatDateBR(album.releaseDate) : 'Em Breve');
      dateEl.textContent = `LANÇAMENTO: ${dateText.toUpperCase()}`;
    }

    const backLink = document.getElementById('album-back-link') || document.querySelector('main.center > a.back');
    if (backLink) {
      if (album.artists && album.artists.length === 1 && SITE_DATA.artists && SITE_DATA.artists[album.artists[0]]) {
        const singleArtist = SITE_DATA.artists[album.artists[0]];
        backLink.href = prefix + getArtistPage(singleArtist);
        backLink.textContent = '← voltar ao artista';
      } else {
        backLink.href = prefix ? prefix + 'index.html' : 'index.html';
        backLink.textContent = '← voltar ao início';
      }
    }

    const tracklistTitle = document.getElementById('album-tracklist-title') || document.querySelector('.album-tracklist-title');
    if (tracklistTitle) {
      tracklistTitle.textContent = `FAIXAS DO ${(album.type || 'ÁLBUM').toUpperCase()}`;
    }

    const platformsContainer = document.getElementById('album-platform-icons') || document.querySelector('.platform-icons');
    if (platformsContainer) {
      if (album.streaming && Object.keys(album.streaming).length > 0) {
        const platformMap = {
          youtube:  { title: "Ouvir no YouTube",     icon: "assets/imagens/icones/youtube.svg" },
          spotify:  { title: "Ouvir no Spotify",     icon: "assets/imagens/icones/spotify.svg" },
          apple:    { title: "Ouvir na Apple Music", icon: "assets/imagens/icones/apple.svg" },
          bandcamp: { title: "Ouvir no Bandcamp",    icon: "assets/imagens/icones/bandcamp.svg" }
        };
        const iconsHTML = Object.entries(album.streaming)
          .filter(([key, url]) => url && platformMap[key])
          .map(([key, url]) => {
            const info = platformMap[key];
            return `
              <a href="${url}" target="_blank" rel="noopener noreferrer" title="${info.title}">
                <img src="${prefix}${info.icon}" alt="${key}">
              </a>
            `;
          }).join('');
        platformsContainer.innerHTML = iconsHTML;
        platformsContainer.style.display = iconsHTML ? 'flex' : 'none';
      } else {
        platformsContainer.innerHTML = '';
        platformsContainer.style.display = 'none';
      }
    }

    const tracklistContainer = document.getElementById('tracklist-table');
    if (tracklistContainer && album.tracks) {
      const isTemplate = /\/projetos\/(index\.html)?$/i.test(path) || path.endsWith('/projetos') || path.endsWith('/projetos/');
      tracklistContainer.innerHTML = album.tracks.map((track, i) => {
        const num = String(i + 1).padStart(2, '0');
        const actionText = track.youtube ? 'OUVIR ▶' : 'VER LETRA ▶';
        const trackHref = isTemplate
          ? `musicas/index.html?album=${encodeURIComponent(album.id)}&track=${encodeURIComponent(track.slug)}`
          : `musicas/index.html?track=${encodeURIComponent(track.slug)}`;
        return `
          <a href="${trackHref}" class="track-row">
            <span class="track-num">${num}</span>
            <span class="track-title">${track.title}</span>
            <span class="track-action">${actionText}</span>
          </a>
        `;
      }).join('');
    }

    // Mensagem / Notas especiais do Álbum (abaixo da tracklist)
    const messageBox = document.getElementById('album-message-box');
    const messageText = document.getElementById('album-message-text');
    const albumMsg = album.message || album.notes || album.description || '';
    if (messageBox && messageText) {
      if (typeof albumMsg === 'string' && albumMsg.trim()) {
        messageText.innerHTML = albumMsg.split(/\r?\n/).join('<br>');
        messageBox.style.display = 'block';
      } else if (Array.isArray(albumMsg) && albumMsg.length > 0) {
        messageText.innerHTML = albumMsg.join('<br>');
        messageBox.style.display = 'block';
      } else {
        messageBox.style.display = 'none';
      }
    }
  }

  // =========================================================
  // 6. RENDERIZADOR DO PLAYER DE MÚSICA (PÁGINAS DE FAIXAS)
  // =========================================================

  function renderSongPlayerPage() {
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';
    if (!path.includes('/musicas/')) return;

    const album = getCurrentAlbum();
    if (!album || !album.tracks || album.tracks.length === 0) return;

    const prefix = getDepthPrefix();
    const params = new URLSearchParams(location.search);
    const slug = params.get('track');

    const foundIdx = album.tracks.findIndex(t => t.slug === slug);
    const idx = foundIdx === -1 ? 0 : foundIdx;
    const track = album.tracks[idx];

    // Metatags dinâmicas de SEO e Open Graph
    const metaTitle = `${track.title} - ${album.title} | Pigpenfan`;
    const metaDesc = (typeof track.lyrics === 'string' && track.lyrics.trim())
      ? `Letra e player da faixa "${track.title}" do álbum "${album.title}". Ouça e confira a letra completa.`
      : `Ouça "${track.title}" do álbum "${album.title}" no Pigpenfan.`;
    const metaImg = album.cover ? prefix + album.cover : '';
    updatePageMeta({ title: metaTitle, description: metaDesc, image: metaImg, type: 'music.song' });

    if (typeof document !== 'undefined' && document.body && album.artists && album.artists.length > 0) {
      for (const cls of Array.from(document.body.classList)) {
        if (cls.startsWith('artist-')) document.body.classList.remove(cls);
      }
      document.body.classList.add(`artist-${album.artists[0]}`);
      document.body.classList.add(album.id);
    }

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && album.cover) {
      favicon.href = prefix + album.cover;
    }
    
    const titleEl = document.getElementById('track-title');
    const artistEl = document.getElementById('track-artist');
    const lyricsEl = document.getElementById('track-lyrics');

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (lyricsEl) lyricsEl.textContent = track.lyrics ? track.lyrics.trim() : '';

    const video = document.getElementById('track-video');
    const videoWrapper = document.getElementById('track-video-wrapper');
    const placeholder = document.getElementById('track-placeholder');

    const placeholderImg = document.getElementById('track-placeholder-img') || (placeholder ? placeholder.querySelector('img') : null);
    if (placeholderImg) {
      placeholderImg.classList.add('img-fade-in');
      placeholderImg.classList.remove('is-loaded');
      placeholderImg.onload = () => placeholderImg.classList.add('is-loaded');
      placeholderImg.onerror = () => placeholderImg.classList.add('is-loaded');
      placeholderImg.src = prefix + (album.cover || 'assets/imagens/capas/placeholder.webp');
      placeholderImg.alt = album.title;
      if (placeholderImg.complete) placeholderImg.classList.add('is-loaded');
    }

    const albumInfoEl = document.getElementById('track-album-info') || document.querySelector('.album-detail-container > .small-text:not(#track-artist)');
    if (albumInfoEl) {
      const typeLabel = album.type || 'Álbum';
      const prodCredit = album.credit || track.artist;
      albumInfoEl.innerHTML = `${typeLabel}: ${album.title} <br> Written and produced by ${prodCredit}`;
    }

    const isTemplate = path.includes('/projetos/musicas/');
    const backLink = document.getElementById('track-back-link') || document.querySelector('main.center > a.back');
    if (backLink) {
      backLink.href = isTemplate ? `../index.html?id=${encodeURIComponent(album.id)}` : '../index.html';
      backLink.textContent = '← voltar';
    }

    if (videoWrapper && placeholder) {
      if (track.youtube) {
        if (video) {
          const ytMatch = String(track.youtube).match(/(?:youtu\.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*)/);
          const ytId = ytMatch ? ytMatch[1] : track.youtube;
          video.src = 'https://www.youtube.com/embed/' + ytId;
          video.title = track.title;
        }
        videoWrapper.style.display = 'flex';
        placeholder.style.display = 'none';
      } else {
        videoWrapper.style.display = 'none';
        placeholder.style.display = 'block';
      }
    }

    const prevTrack = album.tracks[(idx - 1 + album.tracks.length) % album.tracks.length];
    const nextTrack = album.tracks[(idx + 1) % album.tracks.length];

    const prevEl = document.getElementById('track-prev');
    const nextEl = document.getElementById('track-next');

    const albumParam = isTemplate ? `&album=${encodeURIComponent(album.id)}` : '';
    if (prevEl) prevEl.href = '?track=' + encodeURIComponent(prevTrack.slug) + albumParam;
    if (nextEl) nextEl.href = '?track=' + encodeURIComponent(nextTrack.slug) + albumParam;

    try {
      history.replaceState(null, '', '?track=' + encodeURIComponent(track.slug) + albumParam);
    } catch (e) {
      // Ignora erro em contexto de arquivo local (file://)
    }
  }

  // =========================================================
  // 6. RENDERIZADOR E APLICADOR DE BACKGROUND DA PÁGINA
  // =========================================================

  function applyPageBackground() {
    if (typeof SITE_DATA === 'undefined') return;

    const defaultBg = SITE_DATA.defaultBackground || (SITE_DATA.brand && SITE_DATA.brand.background);
    let bgUrl = defaultBg;

    const artistKey = getCurrentArtistKey();
    const album = getCurrentAlbum();

    if (album && album.background) {
      bgUrl = album.background;
    } else if (artistKey && SITE_DATA.artists && SITE_DATA.artists[artistKey]) {
      bgUrl = SITE_DATA.artists[artistKey].background || defaultBg || SITE_DATA.artists[artistKey].portrait;
    } else if (album) {
      bgUrl = album.background || defaultBg || album.cover;
    } else {
      bgUrl = (SITE_DATA.brand && SITE_DATA.brand.background) || defaultBg;
    }

    if (!bgUrl) return;

    const safePath = encodeURI(resolveRelativePath(bgUrl));

    let bgOverlay = document.getElementById('page-bg-overlay');
    if (!bgOverlay && typeof document !== 'undefined' && document.body) {
      bgOverlay = document.createElement('div');
      bgOverlay.id = 'page-bg-overlay';
      document.body.prepend(bgOverlay);
    }

    const applyStyles = () => {
      if (bgOverlay) {
        bgOverlay.style.backgroundImage = `url("${safePath}")`;
        bgOverlay.classList.add('loaded');
      }
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.setProperty('--bg-image', `url("${safePath}")`);
      }
    };

    applyStyles();

    if (typeof Image !== 'undefined') {
      const imgLoader = new Image();
      imgLoader.src = safePath;
      imgLoader.onload = applyStyles;
    }
  }

  // =========================================================
  // RENDERIZADOR DA SEÇÃO DE MERCH / PRODUTOS (CAROUSEL)
  // =========================================================

  function renderMerchSection() {
    const section = document.getElementById('merch') || document.getElementById('merch-section');
    if (!section || typeof SITE_DATA === 'undefined') return;

    const wrapper = document.getElementById('merch-carousel-wrapper');
    const notice = section.querySelector('.merch-notice');
    const items = Array.isArray(SITE_DATA.merch) ? SITE_DATA.merch : [];

    // Se ainda não há produtos cadastrados, exibe apenas "Em Breve"
    if (items.length === 0) {
      if (notice) notice.style.display = 'block';
      if (wrapper) wrapper.style.display = 'none';
      section.style.display = 'block';
      return;
    }

    // Quando houver produtos, renderiza o carrossel no mesmo estilo dos álbuns
    if (notice) notice.style.display = 'none';
    if (!wrapper) return;

    const prefix = getDepthPrefix();

    wrapper.innerHTML = `
      <div class="merch-track-container">
        <div class="merch-track-header">
          <span class="merch-counter">${items.length} ${items.length === 1 ? 'item' : 'itens'}</span>
          <div class="merch-track-nav">
            <button class="merch-track-btn" onclick="window.SiteEngine.scrollMerch(-1)" title="Anterior">‹</button>
            <button class="merch-track-btn" onclick="window.SiteEngine.scrollMerch(1)" title="Próximo">›</button>
          </div>
        </div>
        <div class="merch-track" id="merch-track">
          ${items.map(item => `
            <a href="${item.link || '#'}" class="album-card merch-card" ${item.link && item.link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              <img 
                src="${prefix}${item.image || 'assets/imagens/capas/placeholder.webp'}" 
                alt="${item.title}" 
                class="album-card-cover img-fade-in"
                loading="lazy"
                decoding="async"
                onload="this.classList.add('is-loaded')"
                onerror="this.classList.add('is-loaded')"
              >
              <span class="album-card-title">${item.title}</span>
              <span class="album-card-sub">${item.subtitle || item.status || 'Em Breve'}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
    wrapper.style.display = 'block';
    section.style.display = 'block';

    window.SiteEngine = window.SiteEngine || {};
    window.SiteEngine.scrollMerch = function(direction) {
      const track = document.getElementById('merch-track');
      if (track) {
        track.scrollBy({ left: direction * 220, behavior: 'smooth' });
      }
    };
  }

  // =========================================================
  // RENDERIZADOR DA PÁGINA SOBRE & CAROUSEL DE IMAGENS
  // =========================================================

  let activeGalleryId = null;
  let currentLightboxIdx = 0;
  let galleryEvents = [];

  function getActiveGalleryPhotos() {
    const event = galleryEvents.find(e => e.id === activeGalleryId);
    return event && Array.isArray(event.photos) ? event.photos : [];
  }

  function updateLightboxView() {
    const photos = getActiveGalleryPhotos();
    if (!photos || photos.length === 0) return;

    const item = photos[currentLightboxIdx];
    const prefix = getDepthPrefix();
    const imgPath = typeof item === 'string' ? item : (item.image || '');
    const imgEl = document.getElementById('lightbox-full-image');
    const counterEl = document.getElementById('lightbox-counter');

    if (imgEl) {
      imgEl.src = prefix + imgPath;
      imgEl.alt = `Foto ${currentLightboxIdx + 1} de ${photos.length}`;
    }
    if (counterEl) {
      counterEl.textContent = `${currentLightboxIdx + 1} / ${photos.length}`;
    }

    const carouselCounter = document.getElementById('gallery-carousel-counter');
    if (carouselCounter) {
      carouselCounter.textContent = `${currentLightboxIdx + 1} / ${photos.length}`;
    }
  }

  function openImageLightbox(arg1, arg2) {
    if (typeof arg1 === 'number') {
      currentLightboxIdx = arg1;
    } else if (typeof arg1 === 'string') {
      activeGalleryId = arg1;
      currentLightboxIdx = typeof arg2 === 'number' ? arg2 : 0;
    }

    const photos = getActiveGalleryPhotos();
    if (!photos || photos.length === 0) return;

    currentLightboxIdx = Math.max(0, Math.min(currentLightboxIdx, photos.length - 1));
    const modal = document.getElementById('image-lightbox-modal');
    if (!modal) return;

    updateLightboxView();
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeImageLightbox() {
    const modal = document.getElementById('image-lightbox-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function prevLightboxImage() {
    const photos = getActiveGalleryPhotos();
    if (!photos || photos.length === 0) return;
    currentLightboxIdx = (currentLightboxIdx - 1 + photos.length) % photos.length;
    updateLightboxView();
  }

  function nextLightboxImage() {
    const photos = getActiveGalleryPhotos();
    if (!photos || photos.length === 0) return;
    currentLightboxIdx = (currentLightboxIdx + 1) % photos.length;
    updateLightboxView();
  }

  function scrollAboutGallery(direction) {
    const track = document.getElementById('gallery-carousel-track');
    if (!track) return;
    const card = track.querySelector('.gallery-carousel-card');
    const step = card ? (card.offsetWidth + 20) : 230;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  function scrollGallery(galleryId, direction) {
    if (galleryId && galleryId !== activeGalleryId) {
      switchGalleryEvent(galleryId);
    }
    scrollAboutGallery(direction);
  }

  function renderGalleryCards(photos, prefix, eventId) {
    if (!photos || photos.length === 0) {
      return '<p class="gallery-notice">Em Breve</p>';
    }
    return photos.map((item, index) => {
      const imgPath = typeof item === 'string' ? item : (item.image || '');
      return `
        <div class="gallery-carousel-card" onclick="window.SiteEngine.openImageLightbox('${eventId}', ${index})" role="button" tabindex="0" title="Clique para ampliar" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.SiteEngine.openImageLightbox('${eventId}', ${index});}">
          <div class="gallery-carousel-cover-wrap">
            <img 
              src="${prefix}${imgPath}" 
              alt="Foto ${index + 1}" 
              class="gallery-carousel-cover img-fade-in" 
              loading="lazy"
              decoding="async"
              onload="this.classList.add('is-loaded')"
              onerror="this.classList.add('is-loaded')"
            >
          </div>
        </div>
      `;
    }).join('');
  }

  function switchGalleryEvent(eventId) {
    const event = galleryEvents.find(e => e.id === eventId);
    if (!event) return;
    activeGalleryId = eventId;

    galleryEvents.forEach(e => {
      const tab = document.getElementById(`gallery-tab-${e.id}`);
      if (tab) {
        const isSelected = e.id === eventId;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      }
    });

    const photos = Array.isArray(event.photos) ? event.photos : [];
    const prefix = getDepthPrefix();
    const track = document.getElementById('gallery-carousel-track');
    const counter = document.getElementById('gallery-carousel-counter');

    if (track) {
      track.innerHTML = renderGalleryCards(photos, prefix, event.id);
      track.scrollLeft = 0;
    }

    if (counter) {
      counter.textContent = photos.length > 0 ? `1 / ${photos.length}` : '0 / 0';
    }
  }

  function renderAboutGallery() {
    const wrapper = document.getElementById('about-gallery-carousel-wrapper');
    if (!wrapper || typeof SITE_DATA === 'undefined') return;

    if (Array.isArray(SITE_DATA.aboutGalleries)) {
      galleryEvents = SITE_DATA.aboutGalleries;
    } else if (Array.isArray(SITE_DATA.aboutGallery)) {
      galleryEvents = [{
        id: 'confraterniza-soul',
        title: 'Confraterniza Soul',
        formattedDate: '06/09/26',
        photos: SITE_DATA.aboutGallery
      }];
    } else {
      galleryEvents = [];
    }

    if (galleryEvents.length === 0) return;

    if (!activeGalleryId || !galleryEvents.some(e => e.id === activeGalleryId)) {
      activeGalleryId = galleryEvents[0].id;
    }

    const activeEvent = galleryEvents.find(e => e.id === activeGalleryId) || galleryEvents[0];
    const activePhotos = Array.isArray(activeEvent.photos) ? activeEvent.photos : [];
    const prefix = getDepthPrefix();

    wrapper.innerHTML = `
      <div class="gallery-carousel-header">
        <div class="gallery-event-tabs" role="tablist" aria-label="Selecione o show">
          ${galleryEvents.map((event) => `
            <button type="button"
              class="gallery-event-tab-btn ${event.id === activeGalleryId ? 'active' : ''}"
              id="gallery-tab-${event.id}"
              role="tab"
              aria-selected="${event.id === activeGalleryId ? 'true' : 'false'}"
              onclick="window.SiteEngine.switchGalleryEvent('${event.id}')">
              <span class="gallery-tab-title">${event.title || 'Show'}</span>
              ${event.formattedDate ? `<span class="gallery-tab-sep">&bull;</span><span class="gallery-tab-date">${event.formattedDate}</span>` : ''}
            </button>
          `).join('')}
        </div>

        <div class="gallery-carousel-controls">
          <span class="gallery-carousel-counter" id="gallery-carousel-counter">${activePhotos.length > 0 ? `1 / ${activePhotos.length}` : '0 / 0'}</span>
          <button type="button" class="gallery-carousel-btn" onclick="window.SiteEngine.scrollAboutGallery(-1)" title="Anterior">‹</button>
          <button type="button" class="gallery-carousel-btn" onclick="window.SiteEngine.scrollAboutGallery(1)" title="Próximo">›</button>
        </div>
      </div>

      <div class="gallery-carousel-track" id="gallery-carousel-track" tabindex="0" aria-label="Carrossel de fotos">
        ${renderGalleryCards(activePhotos, prefix, activeEvent.id)}
      </div>
    `;

    const track = document.getElementById('gallery-carousel-track');
    const counter = document.getElementById('gallery-carousel-counter');
    if (track && counter) {
      track.addEventListener('scroll', () => {
        const photos = getActiveGalleryPhotos();
        if (photos.length === 0) return;
        const card = track.querySelector('.gallery-carousel-card');
        if (!card) return;
        const cardWidth = card.offsetWidth + 20;
        const idx = Math.min(photos.length - 1, Math.max(0, Math.round(track.scrollLeft / cardWidth)));
        counter.textContent = `${idx + 1} / ${photos.length}`;
      }, { passive: true });
    }
  }

  function renderAboutPage() {
    const gallery = document.getElementById('about-artists-gallery');
    if (gallery && typeof SITE_DATA !== 'undefined' && SITE_DATA.artists) {
      const prefix = getDepthPrefix();
      gallery.innerHTML = Object.values(SITE_DATA.artists).map(artist => `
        <a href="${prefix}${getArtistPage(artist)}" class="artist-image-card">
          <img 
            src="${prefix}${artist.portrait || `assets/imagens/icones/${artist.id}-icon.webp`}" 
            alt="${artist.name}" 
            class="artist-portrait img-fade-in"
            loading="lazy"
            decoding="async"
            onload="this.classList.add('is-loaded')"
            onerror="this.classList.add('is-loaded')"
          >
          <span class="artist-card-title">${artist.name}</span>
        </a>
      `).join('');
    }

    const textContainer = document.getElementById('about-text-container');
    if (textContainer && typeof SITE_DATA !== 'undefined' && SITE_DATA.aboutText) {
      const paragraphs = Array.isArray(SITE_DATA.aboutText)
        ? SITE_DATA.aboutText
        : SITE_DATA.aboutText
            .split(/\r?\n\s*\r?\n/)
            .map(p => p.replace(/\s+/g, ' ').trim())
            .filter(Boolean);
      textContainer.innerHTML = paragraphs.map(paragraph => `<p class="about-text">${paragraph}</p>`).join('');
    }

    renderAboutGallery();
  }

  // Atalhos de teclado para o modal da imagem (Esc, Setas)
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('image-lightbox-modal');
      if (!modal || modal.style.display === 'none') return;

      if (e.key === 'Escape') {
        closeImageLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      }
    });
  }

  // =========================================================
  // CARREGAMENTO DO BANCO DE DADOS UNIFICADO (CONTENT/DATA.JSON)
  // =========================================================

  let _dataPromise = null;

  async function ensureDataLoaded() {
    if (typeof SITE_DATA === 'undefined') window.SITE_DATA = {};
    if (SITE_DATA.artists && Object.keys(SITE_DATA.artists).length > 0 && Array.isArray(SITE_DATA.albums) && SITE_DATA.albums.length > 0) {
      return SITE_DATA;
    }
    if (_dataPromise) return _dataPromise;

    _dataPromise = (async () => {
      const prefix = getDepthPrefix();
      try {
        const res = await fetch(`${prefix}content/data.json`);
        if (res.ok) {
          const data = await res.json();
          // Mescla todas as entidades do JSON (config, brand, artists, albums, videos, merch, sobre)
          Object.assign(SITE_DATA, data);

          if (typeof SITE_DATA.normalizeArtists === 'function') {
            SITE_DATA.normalizeArtists(SITE_DATA.artists);
          }
          if (typeof SITE_DATA.normalizeAlbums === 'function') {
            SITE_DATA.normalizeAlbums(SITE_DATA.albums);
          }
        }
      } catch (err) {
        console.warn("Aviso: Falha ao carregar content/data.json via fetch.", err);
      }
      return SITE_DATA;
    })();

    return _dataPromise;
  }

  // =========================================================
  // INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO
  // =========================================================

  if (typeof document !== 'undefined') {
    const runAllRenders = async () => {
      await ensureDataLoaded();
      renderTopNav();
      applyPageBackground();
      renderFeaturedVideosSection();
      renderRecentReleasesSection();
      renderHomeArtists();
      renderHomeCollaborations();
      renderHomeContacts();
      renderArtistPage();
      renderAlbumPage();
      renderSongPlayerPage();
      renderMerchSection();
      renderAboutPage();
      applyImageFadeIn();
      registerServiceWorker();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runAllRenders);
    } else {
      runAllRenders();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', runAllRenders);
    }
  }

  function registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

    window.addEventListener('load', () => {
      const prefix = getDepthPrefix();
      navigator.serviceWorker.register(prefix + 'sw.js')
        .then(() => {
          // Registrado com sucesso
        })
        .catch(() => {});
    });
  }

  function applyImageFadeIn(root) {
    const scope = root || document;
    scope.querySelectorAll('img.img-fade-in').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
      }
    });
  }

  // Exportação global
  const SiteEngine = {
    sortItemsByDate,
    formatDateBR,
    getDepthPrefix,
    resolveRelativePath,
    getCurrentArtistKey,
    getCurrentAlbum,
    getSortedVideos,
    getSortedAlbums,
    getRecentReleases,
    applyPageBackground,
    renderTopNav,
    renderFeaturedVideosSection,
    renderRecentReleasesSection,
    renderHomeArtists,
    renderHomeCollaborations,
    renderHomeContacts,
    renderArtistPage,
    renderAlbumPage,
    renderSongPlayerPage,
    renderMerchSection,
    renderAboutPage,
    renderAboutGallery,
    switchGalleryEvent,
    scrollGallery,
    scrollAboutGallery,
    openImageLightbox,
    closeImageLightbox,
    prevLightboxImage,
    nextLightboxImage
  };

  if (typeof window !== 'undefined') {
    window.SiteEngine = Object.assign(window.SiteEngine || {}, SiteEngine);
  }

})();
