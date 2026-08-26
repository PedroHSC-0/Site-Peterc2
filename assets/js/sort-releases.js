/**
 * Organiza automaticamente os elementos .album-card dentro de .album-gallery
 * com base no atributo data-release-date="YYYY-MM-DD".
 * 
 * Ordenação cronológica (asc): do lançamento mais antigo/primeiro para o mais recente/novo.
 * Exemplo: Desert Sample (13/03/2026) vem ANTES de The Ocean Trench (10/04/2026).
 */
function sortAlbumGallery(order = 'asc') {
  const galleries = document.querySelectorAll('.album-gallery');

  galleries.forEach(gallery => {
    const cards = Array.from(gallery.querySelectorAll('.album-card'));

    cards.sort((a, b) => {
      const dateAStr = a.getAttribute('data-release-date') || '9999-12-31';
      const dateBStr = b.getAttribute('data-release-date') || '9999-12-31';

      const dateA = new Date(dateAStr);
      const dateB = new Date(dateBStr);

      if (order === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    // Re-insere os cards ordenados no container
    cards.forEach(card => gallery.appendChild(card));
  });
}

// Executa a ordenação ao carregar a página (ordem cronológica de lançamento)
document.addEventListener('DOMContentLoaded', () => {
  sortAlbumGallery('asc');
});
