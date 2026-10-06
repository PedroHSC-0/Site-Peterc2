/**
 * BANCO DE DADOS CENTRALIZADO DO SITE (SITE DATA)
 * 
 * 100% dos dados utilizados no site (músicas, letras, artistas, integrantes,
 * fotos, redes sociais, álbuns, créditos e vídeos do YouTube) são gerenciados AQUI.
 */

const SITE_DATA = {
  // ---------------------------------------------------------
  // CONFIGURAÇÕES GERAIS E ANALYTICS
  // ---------------------------------------------------------
  analytics: {
    provider: "ga4",
    gaMeasurementId: "G-HF911PG7DV"
  },
  defaultBackground: "assets/imagens/background/background 1.jpg",
  brand: {
    name: "PIGPENFAN",
    title: "Pigpenfan",
    background: "assets/imagens/background/background 1.jpg"
  },

  // ---------------------------------------------------------
  // VÍDEOS EM DESTAQUE (EXIBIDOS NO TOPO DA PÁGINA PRINCIPAL)
  // ---------------------------------------------------------
  videos: [
    {
      id: "trailer-out-of-style",
      title: "Out Of Style (Single Trailer)",
      artist: "Littering",
      releaseDate: "2026-10-09",
      youtube: "OxUAjis-6U8",
      cover: "assets/imagens/capas/out-of-style-cover.jpeg",
      description: "Trailer do novo single Out Of Style da banda Littering."
    },
    {
      id: "the-rescue-video",
      title: "The Rescue (Music Video)",
      artist: "Peterc2",
      releaseDate: "2026-09-23",
      youtube: "q4yJVpG1IJ8",
      cover: "assets/imagens/capas/the-rescue-of-the-cosmic-metaphysical-engineers-cover.jpeg",
      description: "Vídeo da faixa The Rescue por Peterc2."
    },
    {
      id: "the-ocean-trench-full",
      title: "The Ocean Trench (Full Album)",
      artist: "Peterc2 e JC Dive",
      releaseDate: "2026-04-10",
      youtube: "EPZbv-gqIFM",
      cover: "assets/imagens/capas/the-ocean-trench-cover.jpeg",
      description: "Visualizer do Álbum The Ocean Trench por Peterc2 e JC Dive."
    },
    {
      id: "desert-sample-full",
      title: "Desert Sample (EP Completo)",
      artist: "Peterc2 e JC Dive",
      releaseDate: "2026-03-13",
      youtube: "ejZl0Vpves4",
      cover: "assets/imagens/capas/desert-sample-cover.jpeg",
      description: "Vídeo do EP Desert Sample por Peterc2 e JC Dive."
    }
  ],

  // ---------------------------------------------------------
  // ARTISTAS E BANDAS
  // ---------------------------------------------------------
  artists: {
    peterc2: {
      id: "peterc2",
      name: "Peterc2",
      role: "Guitarra, Vocais & Produção",
      portrait: "assets/imagens/icones/peterc2-icon.jpg",
      background: "assets/imagens/background/background 1.jpg",
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
      role: "Guitarra e Vocais",
      portrait: "assets/imagens/icones/jcdive-icon.jpeg",
      background: "assets/imagens/background/background 1.jpg",
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
      role: "Banda",
      portrait: "assets/imagens/icones/littering-icon.png",
      background: "assets/imagens/background/background 1.jpg",
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
  // ÁLBUNS, EPS E SINGLES COM TODAS AS FAIXAS E LETRAS
  // ---------------------------------------------------------
  albums: [
    {
      id: "desert-sample",
      title: "Desert Sample",
      subtitle: "Peterc2 e JC Dive • 13/03/2026",
      credit: "Peterc2 e JC Dive",
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
      },
      tracks: [
        {
          slug: "the-ocean-trench",
          title: "The Ocean Trench",
          artist: "Peterc2 e JC Dive",
          youtube: "GMJ9MhhTVsw",
          lyrics: `I could be better\nBring the fire of you\nThe unit is too high\nUnder the station\n\nScared so stupidly\ntrying to understand the message\nYou cannot rest assured\nAnd act like you could fly\n\nI've been dancing\nOn the ocean floor\nAnd met some fishes\nWho want some more\n\nAll day fish drop playing on the seafloor\nLove that's freedom door\nMaybe someday you'll understand that\nFlying don't mean die\nAnd I'm\n\nFly me like a hot balloon\nFly like angels in the moon\nFly me like a hot balloon in space in place in place in place`
        },
        {
          slug: "canto-do-silencio",
          title: "Canto do Silêncio",
          artist: "JC Dive e Peterc2",
          youtube: "Vb42AxNU-pg",
          lyrics: `O canto do silêncio\nFez sangrar\nOs meus ouvidos\nMe fez sonhar\nCom seus olhos\nCastanhos tão puros\nTão solúveis que fez derreter\nAs lágrimas do meu olhar\n\nÉ que tem algo em você\nQue não me deixa esquecer\nNão me deixa esquecer\nQue aquilo não era amor`
        },
        {
          slug: "noname29",
          title: "Noname 29",
          artist: "Peterc2",
          youtube: "D0Hm8rD7UA0",
          lyrics: ``
        },
        {
          slug: "your-skull",
          title: "Your Skull Is Warm and Soft",
          artist: "Peterc2 e JC Dive",
          youtube: "37bsAFdPYCw",
          lyrics: `Try, try, try do the wind blows ( I hope to return to your skull)\nTry, try, try do the wind blows (I hope to return to your skull)\nTry, try, try do the wind blows ( I hope to return to your skull)\nTry, try, try do the wind blows (I hope to return to your skull)\n\nBarrow Blank\nIts hard to beat\nStand your fight\nWhat you want to be\n\nTry, try, try do the wind blows (I hope to return to your skull)\nTry, try, try do the wind blows (I hope to return to your skull)\nTry, try, try do the wind blows ( I hope to return to your skull)\nTry, try, try do the wind blows ( I hope to return to your skull)\n\nI will never pay attention to what you say.\nI will never pay attention to what you say.\nI will never pay attention to what you say.\nI will never pay attention`
        },
        {
          slug: "lilly",
          title: "Lilly",
          artist: "JC Dive e Peterc2",
          youtube: "px3f54XOjCs",
          lyrics: `Lilly knows too well\nHow to make me feel a thrill sometimes\nFeeling kinda blur\nSometimes sinking in the heat\n\nNever knew too well\nHow to stop to find a cure\nSometimes feeling mind in bloom\nSometimes feeling in the blues\n\nDo i wanna be\nStill lying to myself\nDo i wanna stay\nSinking in this hell\n\nI created it myself because she was never well\nI created it myself because Lilly knows too well\n\nLilly knows too well how to make me feel immune\nSometimes feeling mind in bloom\nSometimes feeling my cheap thrills\n\nAlways found it good\nHow to stop to glance balloons\nSometimes feeling animals\nSometimes killing my pupils\n\nDo i wanna be\nStill lying to myself\nDo i wanna stay\nSinking in this hell\n\nI created it myself because Lilly knows too well\nI created it myself because Lilly knows too well`
        }
      ]
    },
    {
      id: "the-ocean-trench",
      title: "The Ocean Trench",
      subtitle: "Peterc2 e JC Dive • 10/04/2026",
      credit: "Peterc2 e JC Dive",
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
      },
      tracks: [
        {
          slug: "the-ocean-trench",
          title: "The Ocean Trench",
          artist: "Peterc2 e JC Dive",
          youtube: "6JNBU0PBISE",
          lyrics: `I could be better\nBring the fire of you\nThe unit is too high\nUnder the station\n\nScared so stupidly\ntrying to understand the message\nYou cannot rest assured\nAnd act like you could fly\n\nI've been dancing\nOn the ocean floor\nAnd met some fishes\nWho want some more\n\nAll day fish drop playing on the seafloor\nLove that's freedom door\nMaybe someday you'll understand that\nFlying don't mean die\nAnd I'm\n\nFly me like a hot balloon\nFly like angels in the moon\nFly me like a hot balloon in space in place in place in place`
        },
        {
          slug: "golden-trick",
          title: "Golden Trick",
          artist: "Peterc2",
          youtube: "a3BWvTFf6a0",
          lyrics: `I can say? (I Know You)\nI can say?\n\nI can say that you know what you're about to do?\nIt will make everyone walk away from you\nLetting your fiery eyes shoot can harm you\nI decided to leave this fate a long time ago too for you.\n\nI can say?\nI can say? (I Know You)\n\nThere is something in the sky that we want to reach.\nThere something in that place.\nWe can rule the world\nAnd we should\n\nI can say?\nI can say? (I Know You)\n\nStill have so much to offer you\nFor your head\nFor your hair\nFor your eyes\nFor your heart`
        },
        {
          slug: "cleaning",
          title: "Cleaning",
          artist: "Peterc2",
          youtube: "KJd2c3H7-d8",
          lyrics: `Clean up this room there's something there\nCaught in the fire just to get there\n\nClean up this room there's something there\nCaught in the fire just to get there`
        },
        {
          slug: "birds-and-seeds",
          title: "Birds And Seeds",
          artist: "Peterc2",
          youtube: "3L3PtrAo7Zo",
          lyrics: `This threat is for everyone\nThis threat is for everyone\nThis threat is for everyone\nThis threat is for everyone\n\nI'll hold you in acid and salt\nTo keep your roots intact\nif that can keep you\nin the state you're in\n\nThis threat is for everyone\nThis threat is for everyone\n\nI will capture all your blessings one by one\nthis softness can fill me through\nA blossom would set them down`
        },
        {
          slug: "canto-do-silencio",
          title: "Canto do Silêncio",
          artist: "JC Dive e Peterc2",
          youtube: "1OFMx_H76qQ",
          lyrics: `O canto do silêncio\nFez sangrar\nOs meus ouvidos\nMe fez sonhar\nCom seus olhos\nCastanhos tão puros\nTão solúveis que fez derreter\nAs lágrimas do meu olhar\n\nÉ que tem algo em você\nQue não me deixa esquecer\nNão me deixa esquecer\nQue aquilo não era amor`
        },
        {
          slug: "how-bad-is-it",
          title: "How Bad Is It",
          artist: "Peterc2",
          youtube: "viU8gimTItY",
          lyrics: `The drawling curb, is there to stare\nJust to make an unfair set\nIt just found a reason to mess it\nshe's lost right to store\n\nIt's a cream and colorful soak\nthat I can't identify\nthis thriler might come out to hunt you\nAnd come out to let you down\n\nAnd Maybe i can tell you\nHow bad is it\nOnly you can know\nand maybe I could show you\nhow hate can leave\nfrom lows I might throw\n\nIt will be good\n\nI am burying our fidgety eye in amazement\nAlready spoils the frown\nYour wrapped fears and lies are contundent\nThe waves that come around\n\nyour disgust for myself is unfounded.\nAt this moment, I have no bounds.\nI'll gather these bones for you\nTo anywhere you want to go\n\nAnd maybe i can tell you\nHow bad is it\nOnly you can know\nand maybe I could show you\nhow hate can leave\nfrom lows I might throw`
        },
        {
          slug: "i-will-cut-into-you",
          title: "I Will Cut Into You",
          artist: "Peterc2",
          youtube: "2CqlmcCePvI",
          lyrics: `It's open inside a low note\nIs time to fly on a snow flow\nAlmost every time It's a slow grow\nBut not this time, I\nI want you to come back again\nTurn on a light so you'll understand\nI will cut you open\nSo I can Feel Fine\n\nTime\nA strong feeling\nI'm high\nTingles explore me\nWhy\nIt's all getting over\nSomething's wrong\nI ignore the signs\n\nIt's open inside a low note\nIs time to fly on a snow flow\nAlmost every time It's a slow grow\nBut not this time, I\nI want you to come back again\nTurn on a light so you'll understand\nIt's the experience of a lifetime\nNow I think I could die`
        },
        {
          slug: "on-the-house",
          title: "On The House",
          artist: "Peterc2",
          youtube: "30yTVNkFeXI",
          lyrics: `You don't have to lie to me\nI've wandered into your realm\nI've plumbed the depths of your fears\nThe only thing I can find is what draws us together\n\nIs a love\nIs your love\nIs a love\nIs your Love\n\nThat other day\nYou told me that humans are mysteries\nBut you're no mystery to me\nI just haven't unveiled you completely yet\n\nIs a love\nIs your love\nIs a love\nIs your love`
        },
        {
          slug: "lilly",
          title: "Lilly",
          artist: "JC Dive e Peterc2",
          youtube: "l9orgvq8REc",
          lyrics: `Lilly knows too well\nHow to make me feel a thrill sometimes\nFeeling kinda blur\nSometimes sinking in the heat\n\nNever knew too well\nHow to stop to find a cure\nSometimes feeling mind in bloom\nSometimes feeling in the blues\n\nDo i wanna be\nStill lying to myself\nDo i wanna stay\nSinking in this hell\n\nI created it myself because she was never well\nI created it myself because Lilly knows too well\n\nLilly knows too well how to make me feel immune\nSometimes feeling mind in bloom\nSometimes feeling my cheap thrills\n\nAlways found it good\nHow to stop to glance balloons\nSometimes feeling animals\nSometimes killing my pupils\n\nDo i wanna be\nStill lying to myself\nDo i wanna stay\nSinking in this hell\n\nI created it myself because Lilly knows too well\nI created it myself because Lilly knows too well`
        },
        {
          slug: "not-bad-at-all",
          title: "Not Bad at All",
          artist: "Peterc2",
          youtube: "PwF86fd-X1c",
          lyrics: `A fresh pair of puppet socks may keep him\naware of his harsh blasphemy.\nBut the creed of the blind crows\ndecided to abandon him beside of his high mastery.\n\nWinterize the season\nTame the break\nWork to please\nblock your rage\n\nFrom a relic black sparkler\nThere is a war that no one is hoping on.\nHe's afraid to sneaks in to peek\nand see a dead love hanging on.\n\nWinterize the season\nTame the brain\nWork the greed\nput your head in place`
        },
        {
          slug: "my-view-is-bad",
          title: "My View Is Bad",
          artist: "Peterc2 e JC Dive",
          youtube: "FPIJmeBQYa8",
          lyrics: `My view from here is bad but not every time\nAll the clues could have brought me high\nOh, This void might just take a bite\nI can teach you what those noises can be right\nI might see you from the satellite\n\nI have been with the brothers of the big fight\nThis new threat makes my brain fry\nMy vision from here is bad but not every time\nI translate you into machine language\nI can see you from the satellite`
        },
        {
          slug: "possession",
          title: "Possession",
          artist: "Peterc2",
          youtube: "QZE7zb4Dllo",
          lyrics: `I wish you every time you cry again\nLike frank sinatra when you fry within`
        },
        {
          slug: "littering",
          title: "Littering",
          artist: "JC Dive e Peterc2",
          youtube: "NjArWBfAS7c",
          lyrics: `So cold\nAnimals assexual\nYour soul\nSeems to need protection\n\nCan't think about us\nother than happy litter\nhanging on clouds into\nthe endless circles of my life\n\nCan't think about us\nother than happy litter\nhanging on clouds into\nthe endless circles of my life\n\nIt's gold\nCover me with diamonds\nDon't go\nWait until the afternoon\n\nCan't think about us\nother than happy litter\nhanging on clouds into\nthe endless circles of my life\n\nCan't think about us\nother than happy litter\nhanging on clouds into\nthe endless circles of my life\n\nInfinite houses...\nInfinite people...`
        },
        {
          slug: "the-night-shifts",
          title: "The Night Shifts X Radio Report",
          artist: "Peterc2",
          youtube: "sUdQPdzG78A",
          lyrics: ``
        },
        {
          slug: "slow-attack",
          title: "Slow Attack",
          artist: "Peterc2",
          youtube: "SFkEdFMmRYk",
          lyrics: `A blue splinter in rounded bloom\ncovered in garish\nbrought a tall pin, good Samaritan\ncan not lock in the flourish\n\nAnd then we ran away\nWe were scared to death\nThe seeds were broken\nWe lost everything\n\nThe review has been dismissive\nThats a low doom trip\nIts a blocky eyed slippery side\nAnd he offers with anger.\n\nAnd then we ran away\nWe left everything behind\nNothing made sense anymore\nWhat can we do for life to shine again?\n\nThats when we ran away\nTo live without a noose around our necks\nI am dreaming with a time that may never come\nIts a beautiful life to share again\nWhat can we do for life to shine again?`
        },
        {
          slug: "understone",
          title: "Understone",
          artist: "Peterc2",
          youtube: "mfi-5EZJhqE",
          lyrics: ``
        },
        {
          slug: "your-skull",
          title: "Your Skull Is Warm and Soft",
          artist: "Peterc2 e JC Dive",
          youtube: "ycQuwThmUME",
          lyrics: `Try, try, try do the wind blows ( I hope to return to your skull)\nTry, try, try do the wind blows (I hope to return to your skull)\nTry, try, try do the wind blows ( I hope to return to your skull)\nTry, try, try do the wind blows (I hope to return to your skull)\n\nBarrow Blank\nIts hard to beat\nStand your fight\nWhat you want to be\n\nTry, try, try do the wind blows (I hope to return to your skull)\nTry, try, try do the wind blows (I hope to return to your skull)\nTry, try, try do the wind blows ( I hope to return to your skull)\nTry, try, try do the wind blows ( I hope to return to your skull)\n\nI will never pay attention to what you say.\nI will never pay attention to what you say.\nI will never pay attention to what you say.\nI will never pay attention`
        },
        {
          slug: "our-king",
          title: "Our King",
          artist: "Peterc2",
          youtube: "nro1IzIxfh4",
          lyrics: `I told you\nno returns\nShine on me\nyour wisdom\nDream come true\nthings ain't right\n\nHail to your king\nSurrender your life to him\nHail to your king\nSurrender your life to him\n\nWe're going out for a walk\nTake the best takeover instead\nI had something\nYou have it all`
        },
        {
          slug: "noname2",
          title: "Noname 2",
          artist: "Peterc2",
          youtube: "Fq1q81CBtvo",
          lyrics: ``
        },
        {
          slug: "return-to-the-shed",
          title: "Return to The Shed",
          artist: "Peterc2",
          youtube: "ONQIZcr1J04",
          lyrics: `I still remember\nI'll talk about her for another day\nBeen dismissing and fading away\nfeeling a like a heart hanging in defence\n\nIt was supposed to be fair.\nLike a little girl's eyes melted away in the shed\nIt was supposed to be fair\nLike a fortune device just flew to stand in the air\n\ncan't let them escape\nyou can let them stay\ncan't let them escape\nyou can let them stay`
        },
        {
          slug: "corner-van",
          title: "Corner Van",
          artist: "Peterc2 e JC Dive",
          youtube: "8A399hebh6A",
          lyrics: `Licks in my veins\nRiffs are made never the same\nAll vibrations made in vain\nAll guitars are playing break\n\nLives in a van\nSelling drugs to teenage fans\nDrops of hopes and chilling pain\nWatching faces melt in grey\n\nOut of place on town to stay\nAll my heroes did the same\nAnd it felt so great\nAnd grey\nGrey\n\nLicks in my veins\nRiffs are made never the same\nAll vibrations made in vain\nAll guitars are playing break\n\nLives in a van\nSelling drugs to teenage fans\nDrops of hopes and chilling pain\nWatching faces melt in grey`
        }
      ]
    },
    {
      id: "rescue-cosmic",
      title: "The Rescue Of The Cosmic Metaphysical Engineers",
      subtitle: "Em Breve",
      credit: "Peterc2",
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
          youtube: "",
          lyrics: `If you want to do the right to me\nIf you want me to stay\nand i know, i won't dare\nIf you want me to solve the clues\nI am the ancient love\n\nIf you want play the blind with me\nIf you want me to stay\nand you know, i don't care\nIf you want me to share the truth\nI'll be the last to love forevermore`
        },
        {
          slug: "its-calling-you",
          title: "Its Calling You",
          artist: "Peterc2",
          youtube: "",
          lyrics: `Crawling through you\nYou're commanding my head\nsprawl into this\nstrength that you never had\n\nI'm tossing the streets to meet you\nyou've been around and round to the start\nThere's no motion in this life\nthat can wrap this enormous ordeal\n\nYou starred in my dream, dear\nconfusing what has been real,\nyou'd mess it up every cheer that i had\nleaving it with every fear that i'am\n\nI will try it tomorrow\nfall apart with everything we build to see\nyou're branching in sides of a tree\nIt's said thats faster that i can wait\nBut your dream blot out in the spring\n\nI am awaken, no alarms (It happens)\nwhen solid state dreaming spine (It has no end)\n(I hold still)\nin my world is spinning all around (Ahead of despear)\n\nI am waiting, like another (It happens)\nsolid state dreaming spine (Its warm)\ntry to turn this in (I am not allowed)\nall we speak and care (Ahead of despear)\n\nIts calling\nIts frawling\nIts calling\nIts frawling`
        },
        {
          slug: "possession-part-2",
          title: "Possession Part 2",
          artist: "Peterc2",
          youtube: "",
          lyrics: `I don't have the time but I would die for you\nI don't have the time but I would die for you\nI don't have the time but I would die for you (I do)\nI would die for you If i had the time`
        },
        {
          slug: "human-museum",
          title: "Human Museum",
          artist: "Peterc2",
          youtube: "",
          lyrics: `A voice mumbling "carrot babies"\nyou can't understand\n\nFlooding churches\nIn the bachelor station\nBut you can wash yourself\n\nThe freaks step crushed your handbones baby\nYou can just pay their band\n\nI feel stopped as the winds are spreading\nAnd you had just payed your rent`
        },
        {
          slug: "whatever-happened",
          title: "Whatever Happened",
          artist: "Peterc2",
          youtube: "",
          lyrics: `How bad this could get?\nhow bad is doing nothing\nWhen you close a true life\nIt's never close to nothing\nWhen I was a need for you\nin a closedown to rotting\nWhere i merge\n\nI'll be here for you\nHeaven isn't holding a travel to you\nMaybe your just my bad interest\n\nI had an eerie looking\nin the place you've stoled my eyes\nAnd I went out for nothing\nwhere i'll purge\n\nI'll be here for you\nHeaven isn't lookin any closer to you\nHeaven is your whole interest\n\nHow bad is doing nothing true\nI wrote a song for you, and you don't know\nI'm been close to rotting\nwhere you crush\n\ndeath led me to you\nHeaven isn't lowering crawling to you\nIsn't this a bad a interest`
        },
        {
          slug: "asleep",
          title: "Asleep",
          artist: "Peterc2",
          youtube: "",
          lyrics: `I am not a dream\nYou're not asleep\nWe are so free\nYou're not asleep\n\nI won't brag a thing\nDo you glad it all to me\nDreams are led, sir (and all come true)\n\nI am on your tree\nIgnore the screams\nI am not a dream`
        },
        {
          slug: "shaking-hands",
          title: "Shaking Hands",
          artist: "Peterc2",
          youtube: "",
          lyrics: `You had my possessions\nand I won't forget you.\nFeel like natural thing,\nbut I won't forget you.\n\nAnd I hadn't\nshowed any pleasure\nYou know\nI listen to you\nAbsolution\nYou know I hadn't\nYou lost the picture\nyou know\nyou know\nyou know`
        },
        {
          slug: "the-sailor",
          title: "The Sailor",
          artist: "Peterc2",
          youtube: "",
          lyrics: `Sailing away in a mountain of cottons\nSailing away in a mountain of cottons\nSailing away in a mountain of cottons\nSailing away in a mountain of cottons`
        },
        {
          slug: "no-one-spoke",
          title: "No One Spoke",
          artist: "Peterc2",
          youtube: "",
          lyrics: `You maintain controling me\nMy head into my feet\nSpecs all in to me\nAs I walk into the bar\nAnd you roamimg\nI bleed\n\nand you're flaking me\nI love you flaking me\nAs you spoke`
        },
        {
          slug: "under-scort",
          title: "Under Scort",
          artist: "Peterc2",
          youtube: "",
          lyrics: `[Faixa Instrumental]`
        },
        {
          slug: "the-rescue",
          title: "The Rescue",
          artist: "Peterc2",
          youtube: "q4yJVpG1IJ8",
          lyrics: `I feel mistrust behind a blunt\nNobody is here for me\nDisgusted by a drill of wonder\nI'am leveling self deprecation\nbecause the world is round and glad (Inclined to lie in a sky too bright)\nyourself is enough and a need for me\nI want to live down forever (Became a fly to freeze your cries)\n\n(I climb in time to steal your eye)\n(I get you high to seal your mind)`
        },
        {
          slug: "king-shit",
          title: "King Shit",
          artist: "Peterc2",
          youtube: "",
          lyrics: `A bunch of dying rats\nTrying to kiss me\nThe fear of falling wet\non dumb statistics\nblowing drugs and drown\nits in my mistic\n\nPlainning stick ambush\nTry to put the surface out\nthen I'll go running on stakes to miss\nSpitting perfume of the bottle\n\nHey, downcast comrade\ndon't die so simplistic\nPassing as a godly mistrust\nTrying to bliss me\nThose little blown head girls\ncould be so artistic\nbut now they're just statistics\n\nI'am feeling my safety down\nby that grotesque lust\nTheir guns are restraining\nshown off so stupidly\n\nI am running back to my basement\nWhen you got no place to go\nI am running back to the basement\nWhen you're my only trust\nI am running back to the basement\nWhere you got no plans to do\nI am running back to the basement\nWhen you got no place to go`
        },
        {
          slug: "death-valley",
          title: "Death Valley",
          artist: "Peterc2",
          youtube: "",
          lyrics: `Elaboring future faces\nAround the world the rest is yours\nSeen bumping around\ncounting and forming\nWith the winds below\n\nBeen sent around the wishes\nall because of you\nSworn around the fishes\nand lead 'cause of you\nsilenced by your changes\nI weep 'cause of you\nhang around the distance\nThe stress goes for you (All below you)`
        },
        {
          slug: "lady-broom",
          title: "Lady Broom",
          artist: "Peterc2",
          youtube: "",
          lyrics: `I've been drying (A turtle misplaced in to be pure)\nYou've been resting low (skepting blighters, you're clame the swan)\nI've been trying (Are you so under weather)\nYou're my nesting flow (write the letter show me the pleasure)\n\nI've been crying (I will stab to be sure)\nYou've been resting low (You're a eerie shore)\nI've been drying (if you wanna live underwater)\nUnleashed is bad to know (hand me the letter and show me your lesson)\n\nI will stab you to be sure`
        },
        {
          slug: "cosmic-metaphysical-engineers",
          title: "Cosmic metaphysical Engineers",
          artist: "Peterc2",
          youtube: "",
          lyrics: `Breathe in the letter\ni've send you\nhowever it goes\ncut out fawn\nbeen crashing through floor\nyou're done with nowhere to go\n\nBurned bushes\nShe ripped and plunged\nTo feel undereating\nI constantly pushed the very best for you\nyour polluted eyes\nis where I recover from you\n\nIn hypnic jerks\nI greet the rest of you\nA union lever\nor seas of bloodsheds\nThe gods stinginess\nIn rings of plastic\nI brush this blessing from\nthe fraud you are\n\n(It's like a dune devil erased)\n(It's like a doom vapor haze)\n(It's like a dune devil ways)\n(slide a dune devil wave)\n(It's like a doom vapor wave)`
        },
        {
          slug: "no-one-knows",
          title: "No One Knows [Bonus Track]",
          artist: "Peterc2",
          youtube: "",
          lyrics: `No one knows where to hide\neveryone counts on someone to decide\n\nNo one knows where to hide\neveryone counts on someone to decide`
        }
      ]
    },
    {
      id: "out-of-style",
      title: "Out Of Style",
      subtitle: "Littering • 09/10/2026",
      credit: "Littering",
      type: "Single",
      releaseDate: "2026-10-09",
      formattedDate: "09/10/2026",
      cover: "assets/imagens/capas/out-of-style-cover.jpeg",
      link: "projetos/out-of-style/index.html",
      artists: ["littering"],
      streaming: {},
      tracks: [
        {
          slug: "out-of-style",
          title: "Out Of Style",
          artist: "Littering",
          youtube: "",
          lyrics: `When she sticks\npaper in her tongue\nThen she feels\nSings a million songs\nAnd she's gone for now\nUntil she's there for more\nThen she's gone for now\nUntil she's at your door\n\nGirl, You are out of style\nYou are out of style in everything you wanna do\nyou are out of style\nYou are out of style\n\nWhen she said\nNothing is ever gone\nThen I had\nLips and broken bones\nAnd she's gone for now\nbut not until she's there for more\nThen she's gone for now\nbut not until she's at your door\n\nYou are out of style\nYou are out of style in everything you wanna do\nYou are out of style girl\nYou are out of style\nOhh ohh\nYou are out of style, girl\nYou are out of style in everything you wanna do\nyou are out of style\nYou are out of style`
        }
      ]
    }
  ]
};

Object.freeze(SITE_DATA);
