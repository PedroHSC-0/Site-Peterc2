# -*- coding: utf-8 -*-
"""
Script de Compilação do Catálogo do Site Peterc2 / Littering.

Lê todos os arquivos de conteúdo em formato JSON:
  - `content/artistas/*.json` (artistas e bandas)
  - `content/projetos/*.json` (álbuns e faixas)
  - `content/videos.json` (vídeos em destaque)
  - `content/merch.json` (produtos da loja)
  - `content/sobre.json` (biografia e galerias de shows)
  - `content/config.json` (marca, background e analytics)

Gera:
  - `content/data.json` (banco de dados em JSON)
  - `assets/js/site-data.js` (código sincronizado para funcionar em file:// e http://)

Uso:
    python scripts/build.py
"""

import os
import re
import json
import glob

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content')
PROJETOS_DIR = os.path.join(CONTENT_DIR, 'projetos')
ARTISTAS_DIR = os.path.join(CONTENT_DIR, 'artistas')

DATA_JSON_PATH = os.path.join(CONTENT_DIR, 'data.json')
SITE_DATA_JS_PATH = os.path.join(ROOT_DIR, 'assets', 'js', 'site-data.js')

NORMALIZERS_CODE = '''// =========================================================
// NORMALIZAÇÃO E AUTOMAÇÃO DE DADOS
// =========================================================

function parseReleaseDate(input) {
  if (!input || typeof input !== 'string') {
    return { iso: '9999-12-31', br: 'Em Breve' };
  }
  const clean = input.trim();
  if (clean.toLowerCase() === 'em breve' || clean === '9999-12-31') {
    return { iso: '9999-12-31', br: 'Em Breve' };
  }
  const brMatch = clean.match(/^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, '0');
    const month = brMatch[2].padStart(2, '0');
    const year = brMatch[3];
    return {
      iso: `${year}-${month}-${day}`,
      br: `${day}/${month}/${year}`
    };
  }
  const isoMatch = clean.match(/^(\\d{4})-(\\d{1,2})-(\\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return {
      iso: `${year}-${month}-${day}`,
      br: `${day}/${month}/${year}`
    };
  }
  return { iso: clean, br: clean };
}

function normalizeAlbums(albums) {
  if (!Array.isArray(albums)) return;
  const _albumsById = {};
  albums.forEach(album => {
    const rawDate = album.releaseDate || album.date;
    const parsed = parseReleaseDate(rawDate);
    album.releaseDate = parsed.iso;
    
    if (!album.formattedDate) {
      album.formattedDate = parsed.br;
    }
    
    if (!album.subtitle) {
      let author = album.credit;
      if (!author && Array.isArray(album.artists)) {
        author = album.artists
          .map(k => (SITE_DATA.artists && SITE_DATA.artists[k] ? SITE_DATA.artists[k].name : k))
          .join(' e ');
      }
      album.subtitle = author ? `${author} • ${album.formattedDate}` : album.formattedDate;
    }

    if (!album.link && album.id) {
      album.link = `projetos/index.html?id=${encodeURIComponent(album.id)}`;
    }

    if (Array.isArray(album.tracks)) {
      album.tracks.forEach(track => {
        if (!track.artist) {
          track.artist = album.credit || (album.artists && SITE_DATA.artists && SITE_DATA.artists[album.artists[0]] ? SITE_DATA.artists[album.artists[0]].name : '');
        }
        if (!track.slug && track.title) {
          track.slug = track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
      });
    }
    
    if (album.id) {
      _albumsById[album.id] = album;
    }
  });

  if (Array.isArray(SITE_DATA.videos)) {
    SITE_DATA.videos.forEach(video => {
      if (!video.releaseDate && video.albumId && _albumsById[video.albumId]) {
        video.releaseDate = _albumsById[video.albumId].releaseDate;
      } else if (video.releaseDate) {
        const parsed = parseReleaseDate(video.releaseDate);
        video.releaseDate = parsed.iso;
      }
    });
  }
}

function normalizeArtists(artists) {
  if (artists && typeof artists === 'object') {
    Object.entries(artists).forEach(([key, artist]) => {
      if (!artist.id) artist.id = key;
      if (!artist.page) {
        artist.page = `artistas/index.html?id=${encodeURIComponent(artist.id)}`;
      }
      if (!artist.portrait) {
        artist.portrait = `assets/imagens/icones/${artist.id}-icon.webp`;
      }
    });
  }
}

if (typeof SITE_DATA !== 'undefined') {
  if (Array.isArray(SITE_DATA.albums)) normalizeAlbums(SITE_DATA.albums);
  if (SITE_DATA.artists) normalizeArtists(SITE_DATA.artists);
  SITE_DATA.normalizeAlbums = normalizeAlbums;
  SITE_DATA.normalizeArtists = normalizeArtists;
  SITE_DATA.parseReleaseDate = parseReleaseDate;
}

if (typeof window !== 'undefined') {
  window.SITE_DATA = SITE_DATA;
}
'''

def load_json_file(fpath, default=None):
    if not os.path.exists(fpath):
        return default if default is not None else {}
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erro ao ler {fpath}: {e}")
        raise

def parse_date_for_sort(release_date):
    if not release_date:
        return '0000-00-00'
    clean = str(release_date).strip()
    if clean.lower() == 'em breve' or clean == '9999-12-31':
        return '9999-12-31'
    br_match = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', clean)
    if br_match:
        return f"{br_match.group(3)}-{br_match.group(2).zfill(2)}-{br_match.group(1).zfill(2)}"
    return clean

def load_artists():
    if not os.path.isdir(ARTISTAS_DIR):
        return {}
    files = glob.glob(os.path.join(ARTISTAS_DIR, '*.json'))
    artists = {}
    for fpath in files:
        fname = os.path.basename(fpath)
        if fname.startswith('_') or fname.startswith('.'):
            continue
        data = load_json_file(fpath)
        if not isinstance(data, dict):
            continue
        artist_id = data.get('id') or os.path.splitext(fname)[0]
        data['id'] = artist_id
        artists[artist_id] = data
    print(f"👥 Carregados {len(artists)} artistas de {os.path.relpath(ARTISTAS_DIR, ROOT_DIR)}")
    return artists

def load_albums():
    if not os.path.isdir(PROJETOS_DIR):
        return []
    files = glob.glob(os.path.join(PROJETOS_DIR, '*.json'))
    albums = []
    for fpath in files:
        fname = os.path.basename(fpath)
        if fname.startswith('_') or fname.startswith('.'):
            continue
        data = load_json_file(fpath)
        if not isinstance(data, dict):
            continue
        album_id = data.get('id') or os.path.splitext(fname)[0]
        data['id'] = album_id
        albums.append(data)

    albums.sort(key=lambda a: parse_date_for_sort(a.get('releaseDate') or a.get('date')), reverse=True)
    print(f"💿 Carregados {len(albums)} lançamentos de {os.path.relpath(PROJETOS_DIR, ROOT_DIR)}")
    return albums

def main():
    print("🚀 Compilando arquivos JSON do conteúdo...")

    config = load_json_file(os.path.join(CONTENT_DIR, 'config.json'), {})
    videos = load_json_file(os.path.join(CONTENT_DIR, 'videos.json'), [])
    merch = load_json_file(os.path.join(CONTENT_DIR, 'merch.json'), [])
    sobre = load_json_file(os.path.join(CONTENT_DIR, 'sobre.json'), {})

    artists = load_artists()
    albums = load_albums()

    site_data = {
        "analytics": config.get("analytics", {
            "provider": "ga4",
            "gaMeasurementId": "G-HF911PG7DV"
        }),
        "defaultBackground": config.get("defaultBackground", "assets/imagens/background/background-1.webp"),
        "brand": config.get("brand", {
            "name": "PIGPENFAN",
            "title": "Pigpenfan",
            "background": "assets/imagens/background/background-1.webp"
        }),
        "videos": videos,
        "artists": artists,
        "albums": albums,
        "merch": merch,
        "aboutGalleries": sobre.get("aboutGalleries", []),
        "aboutText": sobre.get("aboutText", "")
    }

    # 1. Gera content/data.json
    with open(DATA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(site_data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"✅ Gerado {os.path.relpath(DATA_JSON_PATH, ROOT_DIR)}")

    # 2. Gera assets/js/site-data.js compilado
    js_content = f"""/**
 * BANCO DE DADOS CENTRALIZADO DO SITE (SITE DATA)
 * 
 * ⚠️ ATENÇÃO: ESTE ARQUIVO É GERADO AUTOMATICAMENTE POR `scripts/build.py`.
 * NÃO EDITE ESTE ARQUIVO DIRETAMENTE!
 * 
 * Edite os arquivos fonte em `content/`:
 *   - content/artistas/*.json (Artistas e bandas)
 *   - content/projetos/*.json (Álbuns e singles)
 *   - content/videos.json     (Vídeos em destaque)
 *   - content/merch.json      (Loja/Merch)
 *   - content/sobre.json      (Sobre e shows)
 *   - content/config.json     (Configurações gerais)
 */

const SITE_DATA = {json.dumps(site_data, ensure_ascii=False, indent=2)};

{NORMALIZERS_CODE}
"""
    with open(SITE_DATA_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"✅ Sincronizado {os.path.relpath(SITE_DATA_JS_PATH, ROOT_DIR)}")

    # Remove arquivos legados redundantes se existirem
    for legacy in ['releases.json', 'catalog.json']:
        legacy_path = os.path.join(CONTENT_DIR, legacy)
        if os.path.exists(legacy_path):
            os.remove(legacy_path)

    print("\n✨ Build concluído com sucesso!")
    print("   Fonte única: arquivos JSON em content/")

if __name__ == '__main__':
    main()
