/**
 * BANCO DE DADOS CENTRALIZADO DO SITE (SITE DATA)
 * 
 * Para adicionar um novo álbum ou faixa no futuro:
 * 1. Adicione a imagem da capa em assets/imagens/capas/
 * 2. Adicione o objeto do álbum no array ALBUMS abaixo com a data (releaseDate: "YYYY-MM-DD")
 * 3. O site atualizará automaticamente todas as páginas, ordenações e tracklists!
 */

const SITE_DATA = {
  // ---------------------------------------------------------
  // CONFIGURAÇÃO DE MONITORAMENTO & ANALYTICS
  // ---------------------------------------------------------
  analytics: {
    provider: "ga4", // Google Analytics 4
    gaMeasurementId: "G-HF911PG7DV"
  },

  // ---------------------------------------------------------
  // ARTISTAS E BANDAS
  // ---------------------------------------------------------
  artists: {
    peterc2: {
      id: "peterc2",
      name: "Peterc2",
      role: "",
      portrait: "assets/imagens/icones/peterc2-icon.jpg",
      contacts: {
        instagram: { label: "Instagram", value: "@peterc2_", url: "https://www.instagram.com/peterc2_/", icon: "assets/imagens/icones/instagram.svg" },
        youtube:   { label: "YouTube",   value: "@Peterc2",   url: "https://www.youtube.com/@Peterc2",   icon: "assets/imagens/icones/youtube.svg" },
        spotify:   { label: "Spotify",   value: "Peterc2",    url: "https://open.spotify.com/intl-pt/album/6e4YM0KzxqGHjwpnneDjBG", icon: "assets/imagens/icones/spotify.svg" },
        apple:     { label: "Apple Music", value: "Peterc2",  url: "https://music.apple.com/br/album/desert-sample-ep/1889619290", icon: "assets/imagens/icones/apple.svg" },
        bandcamp:  { label: "Bandcamp",  value: "peterc2.bandcamp.com", url: "https://peterc2.bandcamp.com/", icon: "assets/imagens/icones/bandcamp.svg" }
      }
    },
    jcdive: {
      id: "jcdive",
      name: "JC Dive",
      role: "",
      portrait: "assets/imagens/icones/jcdive-icon.jpeg",
      contacts: {
        instagram: { label: "Instagram", value: "@jcdive_", url: "https://www.instagram.com/jcdive_/", icon: "assets/imagens/icones/instagram.svg" },
        youtube:   { label: "YouTube",   value: null, url: null, icon: "assets/imagens/icones/youtube.svg" },
        spotify:   { label: "Spotify",   value: null, url: null, icon: "assets/imagens/icones/spotify.svg" },
        apple:     { label: "Apple Music", value: null, url: null, icon: "assets/imagens/icones/apple.svg" },
        bandcamp:  { label: "Bandcamp",  value: null, url: null, icon: "assets/imagens/icones/bandcamp.svg" }
      }
    },
    littering: {
      id: "littering",
      name: "Littering",
      role: "",
      portrait: "assets/imagens/icones/littering-icon.png",
      members: [
        { name: "Peterc2", role: "Guitarra e vocais" },
        { name: "JC Dive", role: "Guitarra e vocais" },
        { name: "Pietrawrr", role: "Baixo" },
        { name: "be_cruz", role: "Bateria" }
      ],
      contacts: {
        instagram: { label: "Instagram", value: "@litteringband", url: "https://www.instagram.com/litteringband/", icon: "assets/imagens/icones/instagram.svg" },
        youtube:   { label: "YouTube",   value: "@litteringband", url: "https://www.youtube.com/@litteringband", icon: "assets/imagens/icones/youtube.svg" },
        spotify:   { label: "Spotify",   value: null, url: null, icon: "assets/imagens/icones/spotify.svg" },
        apple:     { label: "Apple Music", value: null, url: null, icon: "assets/imagens/icones/apple.svg" },
        bandcamp:  { label: "Bandcamp",  value: null, url: null, icon: "assets/imagens/icones/bandcamp.svg" }
      }
    }
  },

  // ---------------------------------------------------------
  // ÁLBUNS E EPS (ORDENADOS POR DATA DE LANÇAMENTO)
  // ---------------------------------------------------------
  albums: [
    {
      id: "desert-sample",
      title: "Desert Sample",
      subtitle: "Peterc2 & JC Dive • 13/03/2026",
      type: "Colaboração",
      releaseDate: "2026-03-13",
      formattedDate: "13/03/2026",
      cover: "assets/imagens/capas/desert-sample-cover.jpeg",
      link: "desert-sample/index.html",
      artists: ["peterc2", "jcdive"],
      streaming: {
        youtube: "https://youtu.be/GMJ9MhhTVsw",
        spotify: "https://open.spotify.com/intl-pt/album/6e4YM0KzxqGHjwpnneDjBG",
        apple: "https://music.apple.com/br/album/desert-sample-ep/1889619290",
        bandcamp: "https://peterc2.bandcamp.com/"
      }
    },
    {
      id: "the-ocean-trench",
      title: "The Ocean Trench",
      subtitle: "Peterc2 & JC Dive • 10/04/2026",
      type: "Colaboração",
      releaseDate: "2026-04-10",
      formattedDate: "10/04/2026",
      cover: "assets/imagens/capas/the-ocean-trench-cover.jpeg",
      link: "the-ocean-trench/index.html",
      artists: ["peterc2", "jcdive", "littering"],
      streaming: {
        youtube: "https://www.youtube.com/watch?v=EPZbv-gqIFM",
        spotify: "https://open.spotify.com/album/4QOkz5ITgkpBjD1UTeUVXt",
        apple: "https://music.apple.com/br/album/the-ocean-trench/1891698389",
        bandcamp: "https://peterc2.bandcamp.com/"
      }
    },
    {
      id: "rescue-cosmic",
      title: "The Rescue of the Cosmic Metaphysical Engineers",
      subtitle: "Em Breve",
      type: "Solo",
      releaseDate: "2026-12-31",
      formattedDate: "Em Breve",
      cover: null,
      link: "",
      artists: ["peterc2"],
      streaming: {}
    }
  ]
};

// Congela o objeto de dados para evitar modificações acidentais em tempo de execução
Object.freeze(SITE_DATA);
