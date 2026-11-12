BAYODE WEBSITE + TEN OG IMAGE DESIGNS

The ten separate Open Graph (OG) image designs are in og-images/og-01.jpg through og-10.jpg. Each file is 1200 x 630 (the wide link-preview format), uses real storefront screenshots from your portfolio, and is optimized as a lightweight JPEG. The designs are:
01 Forest Editorial
02 Midnight Mosaic
03 Three-Store Gallery
04 Sage Studio
05 Coral Cutout
06 Black Type / White Space
07 Cobalt / Lime
08 Blueprint Grid
09 Olive Gallery
10 Bright Minimal

CURRENT PREVIEW
The website metadata initially points to og-images/og-01.jpg. A matching copy is also at og-image.jpg for compatibility.

WEEKLY AUTOMATIC ROTATION (OPTIONAL)
This package includes .github/workflows/rotate-og-image.yml and .github/scripts/rotate-og-image.py. When these files and the og-images folder are uploaded to the root of the GitHub Pages repository and pushed to its default branch, GitHub Actions is configured to rotate to the next design every Monday at 09:00 UTC. Each run updates the OG/Twitter image metadata in index.html, synchronizes og-image.jpg, and commits the change. The workflow can also be run manually from the repository's Actions tab.

To enable it, preserve the .github folder and .og-rotation-index file when uploading the ZIP contents. GitHub Actions must be enabled, and the repository's Actions settings must permit the workflow token to write to repository contents. The schedule starts after the workflow is present on the default branch; GitHub can delay scheduled runs. The initial active design is 01, and the first successful weekly run advances to 02.

MANUAL ROTATION
If you do not want automatic commits, select one of og-images/og-01.jpg through og-10.jpg, update the og:image, og:image:secure_url and twitter:image URLs in index.html to that image's public URL, then commit and push. For a quick file-only swap, copy the chosen image over og-image.jpg and keep the page metadata pointed to that same URL.

WHATSAPP NOTE
OG images affect link previews, not a WhatsApp Status photo. WhatsApp may cache a preview for a shared page URL, so changing the file does not guarantee every recipient immediately sees the new design for the same old link. The weekly workflow changes the metadata to a different image URL to encourage refreshed previews, but the platform controls its cache.

SITE FILES
Upload index.html, styles.css, app.js, og-image.jpg, the complete og-images folder, .og-rotation-index, and the .github folder to the root of the repository. The existing website OG metadata uses https://beyubabi.github.io/og-images/og-01.jpg at first.

SHOPIFY LIQUID + CSS SECTION
The portfolio now includes a prominent Shopify theme-development section with Liquid and CSS skills, an illustrative code pattern clearly labeled as an example (not private client source), and the existing client testimonial about a Liquid test.

HTML-TEST PROJECT ASSET
The current upload did not include html-test.jpg: the attached index.html is a 31-product catalogue page, and no html-test image or associated demo URL was included. The specific image-based project card is therefore not fabricated or linked to a guessed URL. Provide the image and exact public project URL to add it accurately.

BEHIND THE BUILDS SLIDESHOW
The Behind the builds section now follows the supplied responsive image-and-copy layout. It cycles through Swiftglamour, Oversize Plus and Fresh Juice every 3.5 seconds; the left/right arrows (outside the image on desktop and below it on mobile) and indicator buttons select slides, and the Play Video links open the existing walkthrough videos. The portfolio uses its own project screenshots, not the jewelry demo images from the reference theme. Upload these three image files to the repository root together with index.html, styles.css and app.js: behind-swiftglamour.jpg, behind-oversize-plus.jpg, behind-fresh-juice.jpg.

HERO SLIDESHOW
The hero now rotates between the real Swiftglamour project and Bayode’s supplied portrait paired with the existing Shopify logo, coding stack, and real Oversize Plus work. Upload hero-bayode-profile.jpg to the repository root along with index.html, styles.css, app.js, behind-swiftglamour.jpg, and behind-oversize-plus.jpg. The portrait is used as supplied; the hero coding card is HTML/CSS, not an AI-generated image.

SELECTED WORK
Section 04 shows the first four portfolio cards initially. Use “See all projects” to reveal the remaining cards; the button then becomes “Show fewer projects” to collapse back to the featured four. The mobile project grid remains two columns. Hero slideshow autoplay is set to 3.5 seconds.

DESKTOP SECTION INDICATOR
A compact vertical dot rail appears on desktop/tablet-wide layouts (1100px and above), links to all 11 page sections, highlights the section around the viewport midpoint, and shows its label beside the active dot. It is hidden below 1100px to keep mobile/tablet navigation clear.

Selected Work order: Oversize Plus, Fresh Juice, Küchewood, followed by the remaining projects.
