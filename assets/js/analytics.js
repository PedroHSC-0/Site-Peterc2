/**
 * SISTEMA DE MÉTRICAS E MONITORAMENTO DE ACESSOS (ANALYTICS)
 * 
 * Monitora automaticamente:
 * 1. Total de visitantes e visualizações de página (incluindo rotas via query string).
 * 2. Cliques em Artistas, Álbuns, Merch, Faixas e Plataformas de Streaming.
 * 3. Cliques nos links de Contatos/Redes Sociais (Instagram, YouTube, Spotify, etc.).
 * 
 * Para ativar o Google Analytics 4:
 * Cole o seu código ID (ex: "G-XXXXXXXXXX") na propriedade `analytics.gaMeasurementId` em `content/config.json`
 * e execute o build (`scripts/build.py`).
 */

(function () {
  // Inicialização do Google Analytics 4 se a TAG estiver presente
  const gaId = (typeof SITE_DATA !== 'undefined' && SITE_DATA.analytics && SITE_DATA.analytics.gaMeasurementId)
    ? SITE_DATA.analytics.gaMeasurementId
    : null;

  if (gaId && gaId !== 'G-SUA-TAG-AQUI') {
    // Carrega o script oficial do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, { page_path: window.location.pathname + window.location.search });
  }

  /**
   * Dispara um evento de telemetria para o GA4 e registra no console em ambiente local.
   */
  function trackEvent(eventName, params = {}) {
    const isLocal = typeof location !== 'undefined' && (
      location.protocol === 'file:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    );
    if (isLocal) {
      console.log(`[Analytics Event] ${eventName}:`, params);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  function getTrimmedText(parent, selector, fallback = '') {
    return parent?.querySelector(selector)?.textContent?.trim() || fallback;
  }

  // Delegação de eventos global: funciona mesmo para elementos renderizados de forma assíncrona
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!target) return;

    // 1. Cliques nos cartões de artistas
    const artistCard = target.closest('.artist-image-card');
    if (artistCard) {
      trackEvent('click_artist', {
        artist_name: getTrimmedText(artistCard, '.artist-card-title', 'Artista')
      });
      return;
    }

    // 2. Cliques nos cartões de merch (verificado antes de .album-card por compartilhar a classe base)
    const merchCard = target.closest('.merch-card');
    if (merchCard) {
      trackEvent('click_merch', {
        item_name: getTrimmedText(merchCard, '.album-card-title', 'Produto')
      });
      return;
    }

    // 3. Cliques nos cartões de álbuns
    const albumCard = target.closest('.album-card');
    if (albumCard) {
      trackEvent('click_album', {
        album_name: getTrimmedText(albumCard, '.album-card-title', 'Álbum')
      });
      return;
    }

    // 4. Cliques nas faixas de música
    const trackRow = target.closest('.track-row, .track-item-link');
    if (trackRow) {
      trackEvent('click_track', {
        track_title: getTrimmedText(trackRow, '.track-title', 'Faixa')
      });
      return;
    }

    // 5. Cliques nos links de contatos e redes sociais
    const contactItem = target.closest('.contact-item.clickable');
    if (contactItem) {
      const label = getTrimmedText(contactItem, '.label', 'Rede');
      const value = getTrimmedText(contactItem, '.value', '');
      const pageArtist = document.getElementById('artist-name-title')?.textContent?.trim();
      const groupArtist = getTrimmedText(contactItem.closest('.contact-group'), '.contact-group-title', '');
      const artist = groupArtist || (pageArtist && pageArtist !== '—' ? pageArtist : 'Geral');

      trackEvent('click_contact', {
        platform: label,
        target: value,
        artist
      });
      return;
    }

    // 6. Cliques nos ícones de plataformas de streaming na página do álbum
    const platformLink = target.closest('.platform-icons a');
    if (platformLink) {
      const platform = platformLink.querySelector('img')?.alt?.trim() || platformLink.getAttribute('title')?.trim() || 'Plataforma';
      const albumTitle = document.getElementById('album-title-el')?.textContent?.trim();

      trackEvent('click_streaming', {
        platform,
        album_name: (albumTitle && albumTitle !== '—') ? albumTitle : 'Álbum'
      });
    }
  });

  // Exporta função global para uso pontual
  window.SiteAnalytics = { trackEvent };
})();
