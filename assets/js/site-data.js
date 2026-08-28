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
      page: "artistas/peterc2/index.html",
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
      page: "artistas/jcdive/index.html",
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
      page: "artistas/littering/index.html",
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
      link: "projetos/desert-sample/index.html",
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
      link: "projetos/the-ocean-trench/index.html",
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
      title: "The Rescue Of The Cosmic Metaphysical Engineers",
      subtitle: "Em Breve",
      type: "Solo",
      releaseDate: "2026-12-31",
      formattedDate: "Em Breve",
      cover: "assets/imagens/capas/the-rescue-of-the-cosmic-metaphysical-engineers-cover.jpeg",
      link: "projetos/the-rescue-of-the-cosmic-metaphysical-engineers/index.html",
      artists: ["peterc2"],
      streaming: {},
      tracks: [
        {
          slug: "pull-back-the-ancients",
          title: "Pull Back the Ancients",
          artist: "Peterc2",
          lyrics: `If you want do the right to me\nIf you want me to stay\nand i know, i won't dare\nIf you want me to solve the clues\nI am the ancient love\n\nIf you want play the blind with me\nIf you want me to stay\nand you know, i don't care\nIf you want me to share the truth\nI'll be the last to love forevermore`
        },
        {
          slug: "its-calling-you",
          title: "Its Calling You",
          artist: "Peterc2",
          lyrics: `Crawling through you\nYou're commanding in my head\nsprawl into this\nstrength that you never had\n\nI'm tossing the streets to meet you\nyou've been around and round to the start\nThere's no motion in this life\nthat can wrap this enormous ordeal\n\nYou starred in my dream, dear\nconfusing what has been real,\nyou'd mess up every cheer that i had\nleaving it with every fear that i'am\n\nI will try it tomorrow\nfall apart with everything we build to see\nyou're branching in sides of a tree\nIt's said thats faster that i can wait\n\nBut your dream blot out in the spring\n\noh oh ohh\nIts calling you\noh oh ohh\nI am calling you\nI fall in you\nI fall in you\n\nfor every omission\n\nI am flawling in you\nI am flawling in you\nI fall in you\nI fall in you\n\nwith every addicton\n\nI am following you`
        },
        {
          slug: "possession-part-2",
          title: "Possession Part 2",
          artist: "Peterc2",
          lyrics: `I don't have the time but I would die for you\nI don't have the time but I would die for you\nI don't have the time but I would die for you (I do)\nI would die for you If i had the time`
        },
        {
          slug: "human-museum",
          title: "Human Museum",
          artist: "Peterc2",
          lyrics: `A voice mumbling "carrot babies"\nyou just can't understand\n\nFlooding churches\nIn the bachelor station\nBut you can wash yourself\n\nThe freaks step crushed your handbones baby\nYou can just pay their band\n\nI feel stopped as the winds are spreading\nAnd you had just payed your rent\n\nohh ohh`
        },
        {
          slug: "shaking-hands",
          title: "Shaking Hands",
          artist: "Peterc2",
          lyrics: `You had my possessions\nand I won't forget you.\nFeel like natural thing,\nbut I won't forget you.\n\nAnd I hadn't\nshowed any pleasure\nYou know\nI listen to you\nAbsolution\nYou know I hadn't\nYou lost the picture\nyou know\nyou know\nyou know`
        },
        {
          slug: "the-sailor",
          title: "The Sailor",
          artist: "Peterc2",
          lyrics: `Sailing away in a mountain of cottons\nSailing away in a mountain of cottons\nSailing away in a mountain of cottons\nSailing away in a mountain of cottons`
        },
        {
          slug: "asleep",
          title: "Asleep",
          artist: "Peterc2",
          lyrics: `I am not a dream\nYou're not asleep\nWe are so free\nYou're not asleep\n\nI won't brag a thing\nDo you glad it all to me\nDreams are led, sir (and all come true)\n\nI am on your tree\nIgnore the screams\nI am not a dream`
        },
        {
          slug: "no-one-spoke",
          title: "No One Spoke",
          artist: "Peterc2",
          lyrics: `You maintain controling me\nMy head into my feet\nSpecs all in to me\nAs I walk into the bar\nAnd you roamimg\nI bleed\n\nand you're flaking me\nI love you flaking me\nAs you spoke`
        },
        {
          slug: "under-scort",
          title: "Under Scort",
          artist: "Peterc2",
          lyrics: `[Faixa Instrumental]`
        },
        {
          slug: "the-rescue",
          title: "The Rescue",
          artist: "Peterc2",
          lyrics: `I feel mistrust behind a blunt\nNobody is here for me\nDisgusted by a drill of wonder\nI'am leveling self deprecation\nbecause the world is round and glad\nyourself is enough and a need for me\nI want to live down forever`
        },
        {
          slug: "death-valley",
          title: "Death Valley",
          artist: "Peterc2",
          lyrics: `Elaboring future faces\nAround the world the rest is yours\nSeen bumping around\ncounting and forming\nWith the winds below\n\nBeen sent around the wishes\nall because of you\nSworn around the fishes\nand lead 'cause of you\nsilenced by your changes\nI weep 'cause of you\nhang around the distance\nThe stress goes for you (All below you)`
        },
        {
          slug: "lady-broom",
          title: "Lady Broom",
          artist: "Peterc2",
          lyrics: `I've been drying (A turtle misplaced in to be pure)\nYou've been resting low (skepting blighters, you're clame the swan)\nI've been trying (Are you so under weather)\nYou're my nesting flow (write the letter show me the pleasure)\n(I don't wanna listen your fucking blues)\n\nI've been crying (I will stab to be sure)\nYou've been resting low (You're a eerie shore)\nI've been drying (if you wanna live underwater)\nUnleashed is bad to know (hand me the letter and show me your lesson)\n\nI will stab you to be sure\n\nOhh\noohh`
        },
        {
          slug: "cosmic-metaphysical-engineers",
          title: "Cosmic metaphysical Engineers",
          artist: "Peterc2",
          lyrics: `Breathe in\nthe letter I send you\nwhoever it goes\ncut out fawn\nbeen crashing through the floor\nyou're done\nwith nowhere to go\n\nBurned bushes\nshe ripped and plunged\nto feel undereating\nI constantly pushed the very best from you\nyour polluted eyes\nis where i recover from you\n\nIn ripnic jerks\ni greet the rest of you\na union lever\nor seas of bloodsheds\nthe gods of stinginess\nin rings of plastic\nI brush this blessing from\nthe fraud you are\n\nIts like a dune devil race\nIts like a doom devil rain\nits like a dune devil eraser\nIts like a dune devil race\nIts like a dune devil race\nIts like a dune devil race\nIts like a dune devil race\nIts like a dune devil race`
        }
      ]
    }
  ]
};

// Congela o objeto de dados para evitar modificações acidentais em tempo de execução
Object.freeze(SITE_DATA);
