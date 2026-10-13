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
    if (path.includes('/musicas/')) return '../../../';
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
   * Identifica a chave do artista atual a partir da classe do body ou pathname.
   */
  function getCurrentArtistKey() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return null;
    const b = typeof document !== 'undefined' ? document.body : null;
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';

    for (const key of Object.keys(SITE_DATA.artists)) {
      if ((b && b.classList.contains(`artist-${key}`)) || path.includes(`/artistas/${key}`) || path.includes(`/${key}/`) || path.endsWith(`/${key}`)) {
        return key;
      }
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

  function getRecentReleases(daysDistance = 60) {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const filtered = SITE_DATA.albums.filter(album => {
      if (!album.releaseDate || album.formattedDate === 'Em Breve' || album.releaseDate === '9999-12-31') {
        return true;
      }

      const parts = album.releaseDate.split('-');
      if (parts.length !== 3) return true;

      const releaseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const diffMs = Math.abs(releaseDate - today);
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return diffDays <= daysDistance;
    });

    return sortItemsByDate(filtered, 'desc', '9999-12-31');
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
    const isPeterc2 = rawPath.includes('/peterc2');
    const isJcDive = rawPath.includes('/jcdive');
    const isLittering = rawPath.includes('/littering');

    const homeUrl = prefix ? prefix + 'index.html' : 'index.html';
    const sobreUrl = prefix + 'sobre/index.html';
    const peterc2Url = prefix + 'artistas/peterc2/index.html';
    const jcdiveUrl = prefix + 'artistas/jcdive/index.html';
    const litteringUrl = prefix + 'artistas/littering/index.html';
    const merchUrl = isHome ? '#merch' : (prefix + 'index.html#merch');
    const contatoUrl = hasLocalContact ? '#contato' : (prefix + 'index.html#contato');

    navContainer.innerHTML = `
      <a href="${homeUrl}" class="top-nav-logo">PIGPENFAN</a>
      <nav class="top-nav-links">
        <a href="${homeUrl}" class="${isHome ? 'active' : ''}">INÍCIO</a>
        <a href="${peterc2Url}" class="${isPeterc2 ? 'active' : ''}">PETERC2</a>
        <a href="${jcdiveUrl}" class="${isJcDive ? 'active' : ''}">JC DIVE</a>
        <a href="${litteringUrl}" class="${isLittering ? 'active' : ''}">LITTERING</a>
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

    function buildCarousel() {
      const video = videos[currentIdx];
      const videoEmbedUrl = `https://www.youtube.com/embed/${video.youtube}`;

      const thumbsHTML = videos.map((v, i) => `
        <button 
          class="video-carousel-thumb-card ${i === currentIdx ? 'active' : ''}" 
          onclick="window.SiteEngine.switchFeaturedVideo(${i})"
          title="${v.title}"
        >
          <img src="${v.cover || 'assets/imagens/capas/placeholder.webp'}" alt="${v.title}" class="video-carousel-thumb-cover">
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

            <div class="video-carousel-thumbs">
              ${thumbsHTML}
            </div>
          </div>
        </div>
      `;
      section.style.display = 'block';
    }

    window.SiteEngine = window.SiteEngine || {};
    window.SiteEngine.switchFeaturedVideo = function(index) {
      if (index >= 0 && index < videos.length) {
        currentIdx = index;
        buildCarousel();
      }
    };

    window.SiteEngine.prevFeaturedVideo = function() {
      currentIdx = (currentIdx - 1 + videos.length) % videos.length;
      buildCarousel();
    };

    window.SiteEngine.nextFeaturedVideo = function() {
      currentIdx = (currentIdx + 1) % videos.length;
      buildCarousel();
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

    const recentAlbums = getRecentReleases(60);
    if (recentAlbums.length === 0) {
      section.style.display = 'none';
      return;
    }

    gallery.innerHTML = recentAlbums.map(album => {
      const coverImg = album.cover || 'assets/imagens/capas/placeholder.webp';
      return `
        <a href="${album.link}" class="album-card" data-release-date="${album.releaseDate}">
          <img src="${coverImg}" alt="${album.title}" class="album-card-cover">
          <span class="album-card-title">${album.title}</span>
          <span class="album-card-sub">${album.subtitle}</span>
        </a>
      `;
    }).join('');

    section.style.display = 'block';
  }

  // =========================================================
  // 3. RENDERIZADOR DE ARTISTAS (PÁGINAS DE ARTISTAS)
  // =========================================================

  function renderArtistPage() {
    const artistKey = getCurrentArtistKey();
    if (!artistKey || typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return;

    const artist = SITE_DATA.artists[artistKey];
    if (!artist) return;

    const gallery = document.querySelector('.artist-projects .album-gallery');
    if (gallery && SITE_DATA.albums) {
      const artistAlbums = sortItemsByDate(
        SITE_DATA.albums.filter(album => album.artists && album.artists.includes(artistKey)),
        'desc'
      );
      const prefix = getDepthPrefix();

      gallery.innerHTML = artistAlbums.map(album => `
        <a href="${prefix}${album.link}" class="album-card" data-release-date="${album.releaseDate}">
          <img src="${prefix}${album.cover}" alt="${album.title}" class="album-card-cover">
          <span class="album-card-title">${album.title}</span>
          <span class="album-card-sub">${album.subtitle}</span>
        </a>
      `).join('');
    }
  }

  // =========================================================
  // 4. RENDERIZADOR DE ÁLBUNS E SINGLES (PÁGINAS DE PROJETOS)
  // =========================================================

  function renderAlbumPage() {
    const album = getCurrentAlbum();
    if (!album) return;

    const tracklistContainer = document.getElementById('tracklist-table');
    if (tracklistContainer && album.tracks) {
      tracklistContainer.innerHTML = album.tracks.map((track, i) => {
        const num = String(i + 1).padStart(2, '0');
        const actionText = track.youtube ? 'OUVIR ▶' : 'VER LETRA ▶';
        return `
          <a href="musicas/index.html?track=${track.slug}" class="track-row">
            <span class="track-num">${num}</span>
            <span class="track-title">${track.title}</span>
            <span class="track-action">${actionText}</span>
          </a>
        `;
      }).join('');
    }
  }

  // =========================================================
  // 5. RENDERIZADOR DO PLAYER DE MÚSICA (PÁGINAS DE FAIXAS)
  // =========================================================

  function renderSongPlayerPage() {
    const path = (typeof location !== 'undefined' && location.pathname) ? location.pathname.toLowerCase().replace(/\\/g, '/') : '';
    if (!path.includes('/musicas/')) return;

    const album = getCurrentAlbum();
    if (!album || !album.tracks || album.tracks.length === 0) return;

    const params = new URLSearchParams(location.search);
    const slug = params.get('track');

    const foundIdx = album.tracks.findIndex(t => t.slug === slug);
    const idx = foundIdx === -1 ? 0 : foundIdx;
    const track = album.tracks[idx];

    document.title = track.title + " - " + album.title;
    
    const titleEl = document.getElementById('track-title');
    const artistEl = document.getElementById('track-artist');
    const lyricsEl = document.getElementById('track-lyrics');

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (lyricsEl) lyricsEl.textContent = track.lyrics ? track.lyrics.trim() : '';

    const video = document.getElementById('track-video');
    const videoWrapper = document.getElementById('track-video-wrapper');
    const placeholder = document.getElementById('track-placeholder');

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

    if (prevEl) prevEl.href = '?track=' + prevTrack.slug;
    if (nextEl) nextEl.href = '?track=' + nextTrack.slug;

    history.replaceState(null, '', '?track=' + track.slug);
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

    if (artistKey && SITE_DATA.artists && SITE_DATA.artists[artistKey]) {
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
              <img src="${prefix}${item.image || 'assets/imagens/capas/placeholder.webp'}" alt="${item.title}" class="album-card-cover">
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
            <img src="${prefix}${imgPath}" alt="Foto ${index + 1}" class="gallery-carousel-cover" loading="lazy">
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
        <a href="${prefix}${artist.page}" class="artist-image-card">
          <img src="${prefix}${artist.portrait}" alt="${artist.name}" class="artist-portrait">
          <span class="artist-card-title">${artist.name}</span>
        </a>
      `).join('');
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
  // INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO
  // =========================================================

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      renderTopNav();
      applyPageBackground();
      renderFeaturedVideosSection();
      renderRecentReleasesSection();
      renderArtistPage();
      renderAlbumPage();
      renderSongPlayerPage();
      renderMerchSection();
      renderAboutPage();
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
