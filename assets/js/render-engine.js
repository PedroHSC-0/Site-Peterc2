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
 */

(function () {

  // =========================================================
  // AUXILIARES DE DATAS E BANCO DE DADOS
  // =========================================================

  // =========================================================
  // AUXILIARES DE DATAS E BANCO DE DADOS
  // =========================================================

  function getSortedVideos(order = 'desc') {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.videos) return [];
    
    return [...SITE_DATA.videos].sort((a, b) => {
      const dateA = new Date(a.releaseDate || '1970-01-01');
      const dateB = new Date(b.releaseDate || '1970-01-01');
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  function getSortedAlbums(order = 'desc') {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return [];
    
    return [...SITE_DATA.albums].sort((a, b) => {
      const dateA = new Date(a.releaseDate || '9999-12-31');
      const dateB = new Date(b.releaseDate || '9999-12-31');
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  function getRecentReleases(daysDistance = 60) {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return SITE_DATA.albums.filter(album => {
      if (!album.releaseDate || album.formattedDate === 'Em Breve' || album.releaseDate === '9999-12-31') {
        return true;
      }

      const parts = album.releaseDate.split('-');
      if (parts.length !== 3) return true;
      
      const releaseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const diffMs = Math.abs(releaseDate - today);
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return diffDays <= daysDistance;
    }).sort((a, b) => {
      const dateA = new Date(a.releaseDate || '9999-12-31');
      const dateB = new Date(b.releaseDate || '9999-12-31');
      return dateB - dateA; // Mais recente primeiro
    });
  }

  // =========================================================
  // 1. RENDERIZADOR DA SEÇÃO DE VÍDEOS EM DESTAQUE (CAROUSEL)
  // =========================================================

  function renderFeaturedVideosSection() {
    const section = document.getElementById('featured-videos-section');
    if (!section || typeof SITE_DATA === 'undefined' || !SITE_DATA.videos || SITE_DATA.videos.length === 0) return;

    // Vídeos priorizados pelo mais recente primeiro
    const videos = getSortedVideos('desc');
    let currentIdx = 0;

    function buildCarousel() {
      const video = videos[currentIdx];
      const videoEmbedUrl = `https://www.youtube.com/embed/${video.youtube}`;
      
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
      };

      const thumbsHTML = videos.map((v, i) => `
        <button 
          class="video-carousel-thumb-card ${i === currentIdx ? 'active' : ''}" 
          onclick="window.SiteEngine.switchFeaturedVideo(${i})"
          title="${v.title}"
        >
          <img src="${v.cover || 'assets/imagens/capas/placeholder.jpeg'}" alt="${v.title}" class="video-carousel-thumb-cover">
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
              <div class="video-carousel-info-meta">${video.artist} ${video.releaseDate ? '• Lançamento: ' + formatDate(video.releaseDate) : ''}</div>
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
      const coverImg = album.cover || 'assets/imagens/capas/placeholder.jpeg';
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
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.artists) return;

    let artistKey = null;
    const bodyClass = document.body.className;
    if (bodyClass.includes('artist-peterc2')) artistKey = 'peterc2';
    else if (bodyClass.includes('artist-jcdive')) artistKey = 'jcdive';
    else if (bodyClass.includes('artist-littering')) artistKey = 'littering';

    if (!artistKey) return;

    const artist = SITE_DATA.artists[artistKey];
    if (!artist) return;

    // Projetos do Artista ordenados por data mais recente primeiro
    const gallery = document.querySelector('.artist-projects .album-gallery');
    if (gallery) {
      const artistAlbums = SITE_DATA.albums
        .filter(album => album.artists && album.artists.includes(artistKey))
        .sort((a, b) => new Date(b.releaseDate || '9999-12-31') - new Date(a.releaseDate || '9999-12-31'));

      gallery.innerHTML = artistAlbums.map(album => {
        // Ajusta o caminho relativo dependendo da profundidade do arquivo
        const isSubdir = location.pathname.includes('/artistas/');
        const prefix = isSubdir ? '../../' : '';
        return `
          <a href="${prefix}${album.link}" class="album-card" data-release-date="${album.releaseDate}">
            <img src="${prefix}${album.cover}" alt="${album.title}" class="album-card-cover">
            <span class="album-card-title">${album.title}</span>
            <span class="album-card-sub">${album.subtitle}</span>
          </a>
        `;
      }).join('');
    }
  }

  // =========================================================
  // 4. RENDERIZADOR DE ÁLBUNS E SINGLES (PÁGINAS DE PROJETOS)
  // =========================================================

  function renderAlbumPage() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return;

    // Descobre o álbum pela URL ou pela classe do body
    const path = location.pathname;
    let albumId = null;

    if (path.includes('desert-sample')) albumId = 'desert-sample';
    else if (path.includes('the-ocean-trench')) albumId = 'the-ocean-trench';
    else if (path.includes('the-rescue-of-the-cosmic-metaphysical-engineers')) albumId = 'rescue-cosmic';
    else if (path.includes('out-of-style')) albumId = 'out-of-style';

    if (!albumId) return;

    const album = SITE_DATA.albums.find(a => a.id === albumId);
    if (!album) return;

    // Preenche a Tracklist Dinâmica
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
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return;
    const path = location.pathname;
    if (!path.includes('/musicas/index.html')) return;

    let albumId = null;
    if (path.includes('desert-sample')) albumId = 'desert-sample';
    else if (path.includes('the-ocean-trench')) albumId = 'the-ocean-trench';
    else if (path.includes('the-rescue-of-the-cosmic-metaphysical-engineers')) albumId = 'rescue-cosmic';
    else if (path.includes('out-of-style')) albumId = 'out-of-style';

    if (!albumId) return;

    const album = SITE_DATA.albums.find(a => a.id === albumId);
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
          video.src = 'https://www.youtube.com/embed/' + track.youtube;
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

    const path = location.pathname;
    const defaultBg = SITE_DATA.defaultBackground || (SITE_DATA.brand && SITE_DATA.brand.background);
    let bgUrl = defaultBg;

    // 1. Páginas de Artistas
    if (path.includes('/artistas/')) {
      let artistKey = null;
      if (path.includes('peterc2')) artistKey = 'peterc2';
      else if (path.includes('jcdive')) artistKey = 'jcdive';
      else if (path.includes('littering')) artistKey = 'littering';

      if (artistKey && SITE_DATA.artists && SITE_DATA.artists[artistKey]) {
        bgUrl = SITE_DATA.artists[artistKey].background || defaultBg || SITE_DATA.artists[artistKey].portrait;
      }
    }
    // 2. Páginas de Álbuns e Singulados (e páginas de faixas)
    else if (path.includes('/projetos/')) {
      let albumId = null;
      if (path.includes('desert-sample')) albumId = 'desert-sample';
      else if (path.includes('the-ocean-trench')) albumId = 'the-ocean-trench';
      else if (path.includes('the-rescue-of-the-cosmic-metaphysical-engineers')) albumId = 'rescue-cosmic';
      else if (path.includes('out-of-style')) albumId = 'out-of-style';

      if (albumId && SITE_DATA.albums) {
        const album = SITE_DATA.albums.find(a => a.id === albumId);
        if (album) {
          bgUrl = album.background || defaultBg || album.cover;
        }
      }
    }
    // 3. Página Inicial (Home)
    else {
      bgUrl = (SITE_DATA.brand && SITE_DATA.brand.background) || defaultBg;
    }

    if (!bgUrl) return;

    // Ajusta o prefixo de caminho relativo dependendo da profundidade da URL
    let depthPrefix = '';
    if (path.includes('/artistas/') || path.includes('/projetos/')) {
      if (path.includes('/musicas/')) {
        depthPrefix = '../../../';
      } else {
        depthPrefix = '../../';
      }
    }

    let fullPath = bgUrl;
    if (!bgUrl.startsWith('http') && !bgUrl.startsWith('/') && !bgUrl.startsWith('.')) {
      fullPath = depthPrefix + bgUrl;
    }

    // Codifica espaços e caracteres especiais para compatibilidade total de URL
    const safePath = encodeURI(fullPath);

    // Garante a existência do elemento de overlay de background no DOM
    let bgOverlay = document.getElementById('page-bg-overlay');
    if (!bgOverlay && typeof document !== 'undefined' && document.body) {
      bgOverlay = document.createElement('div');
      bgOverlay.id = 'page-bg-overlay';
      document.body.prepend(bgOverlay);
    }

    if (bgOverlay) {
      bgOverlay.style.backgroundImage = `url("${safePath}")`;
    }
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.setProperty('--bg-image', `url("${safePath}")`);
    }
  }

  // =========================================================
  // INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO
  // =========================================================

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      applyPageBackground();
      renderFeaturedVideosSection();
      renderRecentReleasesSection();
      renderArtistPage();
      renderAlbumPage();
      renderSongPlayerPage();
    });
  }

  // Exportação global
  if (typeof window !== 'undefined') {
    window.SiteEngine = {
      getSortedVideos,
      getSortedAlbums,
      getRecentReleases,
      applyPageBackground,
      renderFeaturedVideosSection,
      renderRecentReleasesSection,
      renderArtistPage,
      renderAlbumPage,
      renderSongPlayerPage
    };
  }

})();
