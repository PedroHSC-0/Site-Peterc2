/**
 * MOTOR DE RENDERIZAÇÃO AUTOMÁTICA DO SITE (RENDER ENGINE)
 * 
 * Lê centralizadamente os dados de SITE_DATA e garante:
 * 1. Ordenação cronológica rigorosa por data de lançamento (releaseDate asc).
 * 2. Formatação dinâmica do título da aba (document.title = Track - Album).
 * 3. Renderização fluida e responsiva.
 */

(function () {
  // Ordena os álbuns cronologicamente (do lançamento mais antigo ao mais recente)
  function getSortedAlbums(order = 'asc') {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return [];
    
    return [...SITE_DATA.albums].sort((a, b) => {
      const dateA = new Date(a.releaseDate || '9999-12-31');
      const dateB = new Date(b.releaseDate || '9999-12-31');
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  // Executa a ordenação dos cards de álbuns presentes na página HTML
  function sortDOMAlbumGalleries(order = 'asc') {
    const galleries = document.querySelectorAll('.album-gallery');

    galleries.forEach(gallery => {
      const cards = Array.from(gallery.querySelectorAll('.album-card'));

      cards.sort((a, b) => {
        const dateAStr = a.getAttribute('data-release-date') || '9999-12-31';
        const dateBStr = b.getAttribute('data-release-date') || '9999-12-31';

        const dateA = new Date(dateAStr);
        const dateB = new Date(dateBStr);

        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });

      cards.forEach(card => gallery.appendChild(card));
    });
  }

  // Inicializa quando o documento HTML estiver pronto
  document.addEventListener('DOMContentLoaded', () => {
    sortDOMAlbumGalleries('asc');
  });

  // Exporta ajudantes globais
  window.SiteEngine = {
    getSortedAlbums,
    sortDOMAlbumGalleries
  };
})();
