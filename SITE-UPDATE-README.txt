BAYODE PORTFOLIO UPDATE — UPLOAD GUIDE

WHAT CHANGED
- The seven real hero project images and your portrait now have smaller WebP versions for phone and desktop screens. The original JPGs remain as fallbacks.
- The first hero image is prioritized. The next project image and portrait are warmed in the background at low priority.
- The main hero's left/right arrows are removed. Its two slide dots and pause/play button stay.
- Hero copy now appears in a gentle stagger, and the image settles in with a small fade and scale. There is no constant motion, and the effects switch off for visitors who prefer reduced motion.
- The project grid shows four cards across on wide desktop and keeps the two-column mobile layout.
- Behind-the-builds videos open in a popup on the page. Close with the X, click outside, or press Escape.
- The Open Graph image rotates daily through 30 designs. The script adds a date to the image URL to help with caching when the 30-design cycle repeats.

IMAGE-SPEED NOTE
The first 640px WebP is about 19.5 KB, compared with the previous 133.5 KB JPG (about 85% smaller). Its 1280px version is about 56.3 KB. This should make the hero much lighter, but no website can guarantee a 0.1-second load on every phone or network.

FILES IN THIS UPDATE
At the repository root, replace:
- index.html
- styles.css
- app.js

Also upload all 16 new WebP files at the repository root:
- hero-project-01-640.webp through hero-project-07-640.webp
- hero-project-01-1280.webp through hero-project-07-1280.webp
- hero-bayode-profile-480.webp
- hero-bayode-profile-960.webp

For daily OG rotation, upload/replace these at their exact paths:
- .github/scripts/rotate-og-image.py
- .github/workflows/rotate-og-image.yml
- og-images/og-01.jpg through og-images/og-30.jpg

KEEP the other files already in your website repository. In particular, keep the original hero JPGs (they are fallback images), the Behind the builds JPGs, and the rest of your site's images and files. This is an update package, not a replacement for the entire website.

Do not replace an existing .og-rotation-index file; it remembers which design is next. If your repository does not have one yet, the workflow will create it after its first run.

UPLOADING THROUGH GITHUB
1. Unzip this package.
2. Replace index.html, styles.css and app.js in the repository root. Upload the 16 WebP files to that same root.
3. Upload the 30 JPGs inside the existing og-images folder. If you use GitHub's web page, open that folder first and upload the files there; do not put them in the repository root.
4. Put the Python file at .github/scripts/rotate-og-image.py and the workflow at .github/workflows/rotate-og-image.yml. If the folders do not exist, use Add file > Create new file and enter the complete path (for example, .github/workflows/rotate-og-image.yml). GitHub Desktop or Git from a computer can upload the unzipped folder structure in one commit.
5. Commit the changes on the repository's default branch (usually main) and make sure GitHub Actions is enabled.

SCHEDULE
The workflow is scheduled daily for 09:17 UTC, which is 10:17 a.m. in Lagos/Nigeria (WAT). GitHub can start scheduled jobs late, so this is a target time, not an exact guarantee. It rotates through all 30 images, then starts again. A manual 'Run workflow' also advances the image once.

WhatsApp and other social apps may cache a link preview on their side. The site will publish a new image URL each day, but an old chat/link preview may not refresh immediately.
