from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[2]
STATE = ROOT / ".og-rotation-index"

try:
    current = int(STATE.read_text(encoding="utf-8").strip())
except (FileNotFoundError, ValueError):
    current = 0
next_index = current % 30 + 1
relative_image = f"og-images/og-{next_index:02d}.jpg"
image_file = ROOT / relative_image
if not image_file.is_file():
    raise SystemExit(f"Missing OG variant: {image_file}")

# Keep the legacy/default filename in sync for hosts or clients that use it.
shutil.copyfile(image_file, ROOT / "og-image.jpg")
index_file = ROOT / "index.html"
html = index_file.read_text(encoding="utf-8")
image_url = f"https://beyubabi.github.io/{relative_image}"
for attribute, value in (("property", "og:image"), ("property", "og:image:secure_url"), ("name", "twitter:image")):
    pattern = rf'(<meta\s+{attribute}="{re.escape(value)}"\s+content=")[^"]*(">)'
    html, count = re.subn(pattern, rf"\g<1>{image_url}\g<2>", html, count=1)
    if count != 1:
        raise SystemExit(f"Expected exactly one meta tag for {value}; found {count}")
index_file.write_text(html, encoding="utf-8")
STATE.write_text(f"{next_index}\n", encoding="utf-8")
print(f"Selected OG design {next_index:02d}: {relative_image}")
