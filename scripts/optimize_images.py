import os
import shutil
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(ROOT_DIR, 'assets', 'imagens')
BACKUP_DIR = os.path.join(os.path.expanduser('~'), 'Documents', 'Site-Peterc2-Backups', 'imagens_backup')

def create_full_backup():
    """Copia 100% de assets/imagens para a pasta de backup em Documentos de forma segura."""
    if os.path.exists(BACKUP_DIR):
        print(f"📁 Pasta de backup já existe em: {BACKUP_DIR}")
        return

    print(f"📦 Criando backup completo de todas as imagens originais em {BACKUP_DIR}...")
    os.makedirs(os.path.dirname(BACKUP_DIR), exist_ok=True)
    shutil.copytree(IMAGES_DIR, BACKUP_DIR)
    
    orig_count = sum(len(files) for _, _, files in os.walk(IMAGES_DIR))
    bkp_count = sum(len(files) for _, _, files in os.walk(BACKUP_DIR))
    print(f"✅ Backup concluído com sucesso! {bkp_count} arquivos preservados com segurança.\n")
    assert orig_count == bkp_count, "Número de arquivos no backup difere do original!"

def optimize_heavy_images():
    """Otimiza apenas imagens acima de 300 KB mantendo alta fidelidade visual."""
    print("🔍 Analisando imagens pesadas (> 300 KB) para otimização de alta fidelidade...")

    optimized_count = 0
    total_saved_bytes = 0

    for root, dirs, files in os.walk(IMAGES_DIR):
        # Ignora a pasta de backup caso esteja aninhada
        if 'imagens_backup' in root:
            continue

        for fname in files:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in ('.webp', '.png', '.jpg', '.jpeg'):
                continue

            fpath = os.path.join(root, fname)
            original_size = os.path.getsize(fpath)

            if original_size < 300 * 1024:
                continue

            try:
                im = Image.open(fpath)
                w, h = im.size

                # Determina limites inteligentes dependendo do tipo da imagem
                rel_path = os.path.relpath(fpath, ROOT_DIR)
                is_icon = 'icones' in rel_path
                is_cover = 'capas' in rel_path
                is_bg = 'background' in rel_path
                is_photo = 'sobre' in rel_path

                new_w, new_h = w, h
                quality = 85

                if is_icon:
                    # Ícones são exibidos em ~100px. 600px dá 6x de densidade (perfeito para telas 4K Retina)
                    max_dim = 600
                    if max(w, h) > max_dim:
                        ratio = max_dim / max(w, h)
                        new_w, new_h = int(w * ratio), int(h * ratio)
                    quality = 88
                elif is_cover:
                    # Capas são exibidas em ~220px. 1200px dá mais de 5x de resolução
                    max_dim = 1200
                    if max(w, h) > max_dim:
                        ratio = max_dim / max(w, h)
                        new_w, new_h = int(w * ratio), int(h * ratio)
                    quality = 88
                elif is_bg:
                    # Backgrounds são exibidos em tela cheia e têm blur(8px)
                    max_w = 1920
                    if w > max_w:
                        ratio = max_w / w
                        new_w, new_h = int(w * ratio), int(h * ratio)
                    quality = 82
                elif is_photo:
                    # Fotos de shows exibidas no lightbox
                    max_dim = 1600
                    if max(w, h) > max_dim:
                        ratio = max_dim / max(w, h)
                        new_w, new_h = int(w * ratio), int(h * ratio)
                    quality = 85

                # Redimensiona se necessário com filtro Lanczos de alta fidelidade
                if (new_w, new_h) != (w, h):
                    im_opt = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
                else:
                    im_opt = im

                # Salva temporariamente para comparar tamanho
                temp_path = fpath + '.temp.webp'
                save_kwargs = {'format': 'WEBP', 'quality': quality, 'method': 6}
                im_opt.save(temp_path, **save_kwargs)
                new_size = os.path.getsize(temp_path)

                # Só substitui se o novo arquivo for realmente menor
                if new_size < original_size:
                    os.replace(temp_path, fpath)
                    saved = original_size - new_size
                    total_saved_bytes += saved
                    optimized_count += 1
                    pct = (saved / original_size) * 100
                    print(f" ✨ {rel_path}: {original_size/1024:6.1f} KB ➔ {new_size/1024:5.1f} KB (-{pct:.1f}%) | {w}x{h} ➔ {new_w}x{new_h}")
                else:
                    os.remove(temp_path)

            except Exception as e:
                print(f"⚠️ Erro ao processar {fpath}: {e}")

    saved_mb = total_saved_bytes / (1024 * 1024)
    print(f"\n🎉 Otimização concluída!")
    print(f"   Imagens otimizadas: {optimized_count}")
    print(f"   Economia total de tráfego: {saved_mb:.2f} MB")
    print(f"   Todas as imagens originais intocadas continuam em: {BACKUP_DIR}")

if __name__ == '__main__':
    create_full_backup()
    optimize_heavy_images()
