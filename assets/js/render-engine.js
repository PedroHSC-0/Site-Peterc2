/**
 * MOTOR DE RENDERIZAÇÃO AUTOMÁTICA DO SITE (RENDER ENGINE)
 * 
 * Lê centralizadamente os dados de SITE_DATA e garante:
 * 1. Ordenação cronológica rigorosa por data de lançamento (releaseDate asc).
 * 2. Cálculo e exibição dinâmica de lançamentos recentes (±60 dias do passado e futuro).
 * 3. Formatação dinâmica de títulos e componentes.
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

  // Retorna álbuns lançados ou a serem lançados a uma distância de até X dias (passado e futuro)
  // ou lançamentos sem data definida ("Em Breve")
  function getRecentReleases(daysDistance = 60) {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.albums) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return SITE_DATA.albums.filter(album => {
      // Inclui lançamentos sem data definida ou marcados como "Em Breve"
      if (!album.releaseDate || album.formattedDate === 'Em Breve' || album.releaseDate === '9999-12-31') {
        return true;
      }

      const parts = album.releaseDate.split('-');
      if (parts.length !== 3) return true;
      
      const releaseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      
      // Diferença em milissegundos convertida em dias (Math.abs considera futuro e passado)
      const diffMs = Math.abs(releaseDate - today);
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return diffDays <= daysDistance;
    }).sort((a, b) => {
      const dateA = new Date(a.releaseDate || '9999-12-31');
      const dateB = new Date(b.releaseDate || '9999-12-31');
      return dateA - dateB;
    });
  }

  // Renderiza a seção de lançamentos recentes se o container existir na página HTML
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
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      renderRecentReleasesSection();
      sortDOMAlbumGalleries('asc');
    });
  }

  // Exporta ajudantes globais
  if (typeof window !== 'undefined') {
    window.SiteEngine = {
      getSortedAlbums,
      getRecentReleases,
      sortDOMAlbumGalleries
    };
  }
})();
