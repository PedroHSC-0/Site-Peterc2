# -*- coding: utf-8 -*-
"""
Script de Compilação do Catálogo e Estilos do Site Peterc2 / Littering.

Lê todos os arquivos de conteúdo em formato JSON e módulos CSS:
  - `content/artistas/*.json` (artistas e bandas)
  - `content/projetos/*.json` (álbuns e faixas)
  - `content/videos.json` (vídeos em destaque)
  - `content/merch.json` (produtos da loja)
  - `content/sobre.json` (biografia e galerias de shows)
  - `content/config.json` (marca, background e analytics)
  - `assets/css/modules/*.css` (módulos de estilo)

Gera:
  - `content/data.json` (banco de dados normalizado em JSON)
  - `assets/js/site-data.js` (dados sincronizados para funcionar em file:// e http://)
  - `assets/css/style.css` (folha de estilos única sem @import)

Uso:
    python scripts/build.py
"""

import os
import re
import json
import glob
from urllib.parse import quote

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content')
PROJETOS_DIR = os.path.join(CONTENT_DIR, 'projetos')
ARTISTAS_DIR = os.path.join(CONTENT_DIR, 'artistas')

DATA_JSON_PATH = os.path.join(CONTENT_DIR, 'data.json')
SITE_DATA_JS_PATH = os.path.join(ROOT_DIR, 'assets', 'js', 'site-data.js')

CSS_DIR = os.path.join(ROOT_DIR, 'assets', 'css')
CSS_MODULES_DIR = os.path.join(CSS_DIR, 'modules')
STYLE_CSS_PATH = os.path.join(CSS_DIR, 'style.css')

CSS_MODULES = [
    'fonts.css',
    'base.css',
    'components.css',
    'home.css',
    'artists.css',
    'albums.css',
    'overrides.css',
]


def load_json_file(fpath, default=None):
    if not os.path.exists(fpath):
        return default if default is not None else {}
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erro ao ler {fpath}: {e}")
        raise


def parse_release_date(raw_value):
    """Normaliza datas BR/ISO/'Em Breve' para o par (iso, br)."""
    if not raw_value or not isinstance(raw_value, str):
        return '9999-12-31', 'Em Breve'

    clean = raw_value.strip()
    if clean.lower() == 'em breve' or clean == '9999-12-31':
        return '9999-12-31', 'Em Breve'

    br_match = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', clean)
    if br_match:
        day = br_match.group(1).zfill(2)
        month = br_match.group(2).zfill(2)
        year = br_match.group(3)
        return f'{year}-{month}-{day}', f'{day}/{month}/{year}'

    iso_match = re.match(r'^(\d{4})-(\d{1,2})-(\d{1,2})$', clean)
    if iso_match:
        year = iso_match.group(1)
        month = iso_match.group(2).zfill(2)
        day = iso_match.group(3).zfill(2)
        return f'{year}-{month}-{day}', f'{day}/{month}/{year}'

    return clean, clean


def load_artists():
    if not os.path.isdir(ARTISTAS_DIR):
        return {}
    files = sorted(glob.glob(os.path.join(ARTISTAS_DIR, '*.json')))
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
    files = sorted(glob.glob(os.path.join(PROJETOS_DIR, '*.json')))
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

    print(f"💿 Carregados {len(albums)} lançamentos de {os.path.relpath(PROJETOS_DIR, ROOT_DIR)}")
    return albums


def normalize_artists(artists):
    """Preenche campos derivados (id, page, portrait) nos artistas."""
    if not isinstance(artists, dict):
        return
    for key, artist in artists.items():
        if not artist.get('id'):
            artist['id'] = key
        if not artist.get('page'):
            artist['page'] = f"artistas/index.html?id={quote(artist['id'], safe='')}"
        if not artist.get('portrait'):
            artist['portrait'] = f"assets/imagens/icones/{artist['id']}-icon.webp"


def normalize_albums(albums, artists):
    """Normaliza datas, subtítulos, links e faixas dos álbuns e ordena por data."""
    if not isinstance(albums, list):
        return

    for album in albums:
        raw_date = album.get('releaseDate') or album.get('date')
        iso_date, br_date = parse_release_date(raw_date)
        album['releaseDate'] = iso_date

        if not album.get('formattedDate'):
            album['formattedDate'] = br_date

        if not album.get('subtitle'):
            author = album.get('credit')
            if not author and isinstance(album.get('artists'), list):
                author = ' e '.join(
                    (artists[k].get('name', k) if isinstance(artists, dict) and k in artists else k)
                    for k in album['artists']
                )
            album['subtitle'] = f"{author} • {album['formattedDate']}" if author else album['formattedDate']

        if not album.get('link') and album.get('id'):
            album['link'] = f"projetos/index.html?id={quote(album['id'], safe='')}"

        tracks = album.get('tracks')
        if isinstance(tracks, list):
            first_artist_key = (
                album['artists'][0]
                if isinstance(album.get('artists'), list) and album['artists']
                else None
            )
            fallback_artist = (
                artists.get(first_artist_key, {}).get('name', '')
                if isinstance(artists, dict) and first_artist_key
                else ''
            )
            for track in tracks:
                if not track.get('artist'):
                    track['artist'] = album.get('credit') or fallback_artist
                if not track.get('slug') and track.get('title'):
                    track['slug'] = re.sub(r'[^a-z0-9]+', '-', track['title'].lower()).strip('-')

    albums.sort(key=lambda a: a.get('releaseDate') or '0000-00-00', reverse=True)


def normalize_videos(videos, albums):
    """Herda ou normaliza a data de lançamento dos vídeos em destaque."""
    if not isinstance(videos, list):
        return

    albums_by_id = {a['id']: a for a in albums if isinstance(a, dict) and a.get('id')}
    for video in videos:
        if not isinstance(video, dict):
            continue
        album_id = video.get('albumId')
        if not video.get('releaseDate') and album_id in albums_by_id:
            video['releaseDate'] = albums_by_id[album_id]['releaseDate']
        elif video.get('releaseDate'):
            video['releaseDate'], _ = parse_release_date(video['releaseDate'])


def build_css_bundle():
    """Concatena os módulos CSS em assets/css/style.css eliminando cascata de @import."""
    sections = [
        "/* =========================================================\n"
        "   SITE PETERC2 - ESTILOS PRINCIPAIS (BUNDLE GERADO)\n"
        "   ⚠️ ATENÇÃO: ARQUIVO GERADO AUTOMATICAMENTE POR `scripts/build.py`.\n"
        "   Edite os módulos em `assets/css/modules/`.\n"
        "   ========================================================= */"
    ]

    for mod_name in CSS_MODULES:
        mod_path = os.path.join(CSS_MODULES_DIR, mod_name)
        if not os.path.isfile(mod_path):
            raise FileNotFoundError(f"Módulo CSS ausente: {mod_path}")
        with open(mod_path, 'r', encoding='utf-8') as f:
            css_text = f.read().strip()

        # Ajusta caminhos relativos de assets/css/modules/ (../../) para assets/css/ (../)
        css_text = re.sub(r'url\(([\'"]?)\.\./\.\./', r'url(\1../', css_text)
        sections.append(f"\n/* --- MODULE: {mod_name} --- */\n{css_text}")

    bundle_content = "\n".join(sections) + "\n"
    with open(STYLE_CSS_PATH, 'w', encoding='utf-8') as f:
        f.write(bundle_content)
    print(f"🎨 Bundle CSS gerado em {os.path.relpath(STYLE_CSS_PATH, ROOT_DIR)} ({len(CSS_MODULES)} módulos)")


def main():
    print("🚀 Compilando arquivos JSON do conteúdo e bundle CSS...")

    config = load_json_file(os.path.join(CONTENT_DIR, 'config.json'), {})
    videos = load_json_file(os.path.join(CONTENT_DIR, 'videos.json'), [])
    merch = load_json_file(os.path.join(CONTENT_DIR, 'merch.json'), [])
    sobre = load_json_file(os.path.join(CONTENT_DIR, 'sobre.json'), {})

    artists = load_artists()
    normalize_artists(artists)

    albums = load_albums()
    normalize_albums(albums, artists)
    normalize_videos(videos, albums)

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

    # 2. Gera assets/js/site-data.js compilado (dados já normalizados em Python)
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

if (typeof window !== 'undefined') {{
  window.SITE_DATA = SITE_DATA;
}}
"""
    with open(SITE_DATA_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"✅ Sincronizado {os.path.relpath(SITE_DATA_JS_PATH, ROOT_DIR)}")

    # 3. Gera bundle CSS em assets/css/style.css
    build_css_bundle()

    # Remove arquivos legados redundantes se existirem
    for legacy in ['releases.json', 'catalog.json']:
        legacy_path = os.path.join(CONTENT_DIR, legacy)
        if os.path.exists(legacy_path):
            os.remove(legacy_path)

    print("\n✨ Build concluído com sucesso!")
    print("   Fonte única: arquivos JSON em content/ e módulos em assets/css/modules/")


if __name__ == '__main__':
    main()
