/**
 * SISTEMA DE MÉTRICAS E MONITORAMENTO DE ACESSOS (ANALYTICS)
 * 
 * Monitora automaticamente:
 * 1. Total de visitantes e visualizações de página.
 * 2. Visualizações de páginas de Artistas, Álbuns e Músicas.
 * 3. Cliques nos links de Contatos/Redes Sociais (Instagram, YouTube, Spotify, etc.).
 * 
 * Para ativar o Google Analytics 4:
 * Cole o seu código ID (ex: "G-XXXXXXXXXX") na propriedade gaMeasurementId do site-data.js!
 */

(function () {
  // Inicialização do Google Analytics 4 se a TAG estiver presente
  const gaId = (typeof SITE_DATA !== 'undefined' && SITE_DATA.analytics && SITE_DATA.analytics.gaMeasurementId)
    ? SITE_DATA.analytics.gaMeasurementId
    : null;

  if (gaId && gaId !== "G-SUA-TAG-AQUI") {
    // Carrega o script oficial do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, { page_path: window.location.pathname });
  }

  // Função auxiliar para disparar eventos
  function trackEvent(eventName, params = {}) {
    console.log(`[Analytics Event] ${eventName}:`, params);
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  // Rastreamento automático de cliques quando a página é carregada
  document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Monitora cliques nos cartões de artistas
    document.querySelectorAll('.artist-image-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.artist-card-title')?.textContent || 'Artista';
        trackEvent('click_artist', { artist_name: title });
      });
    });

    // 2. Monitora cliques nos cartões de álbuns
    document.querySelectorAll('.album-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.album-card-title')?.textContent || 'Álbum';
        trackEvent('click_album', { album_name: title });
      });
    });

    // 3. Monitora cliques nas faixas de música (Apple Music style)
    document.querySelectorAll('.track-row, .track-item-link').forEach(row => {
      row.addEventListener('click', () => {
        const title = row.querySelector('.track-title')?.textContent || 'Faixa';
        trackEvent('click_track', { track_title: title });
      });
    });

    // 4. Monitora cliques nos links de contatos e redes sociais
    document.querySelectorAll('.contact-item.clickable').forEach(item => {
      item.addEventListener('click', () => {
        const label = item.querySelector('.label')?.textContent || 'Rede';
        const value = item.querySelector('.value')?.textContent || '';
        const groupTitle = item.closest('.contact-group')?.querySelector('.contact-group-title')?.textContent || 'Geral';

        trackEvent('click_contact', {
          platform: label,
          target: value,
          artist: groupTitle
        });
      });
    });

  });

  // Exporta função global para uso pontual
  window.SiteAnalytics = { trackEvent };
})();
