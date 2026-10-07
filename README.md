# Bayode — former-color portfolio refresh

This complete static portfolio is based on the user's existing `beyubabi/beyubabi.github.io` repository at commit `b372c00`. It restores the requested former dark-slate, emerald-green and cobalt-blue colors while keeping the improved typography, layout, mobile navigation and accessibility fixes. The portrait banner now matches the former website palette. The original live site has not been changed.

Existing portfolio projects, prices, calculator, project/video modals, FAQ and contact links are preserved. New positioning/copy recommendations are supplied separately; this package does not silently add a new service or change its pricing.

## Upload to GitHub Pages

Extract the ZIP. Upload the extracted files—not the ZIP itself—to the publishing root of `beyubabi/beyubabi.github.io`. Keep `index.html`, `styles.css`, `brand.css`, `app.js`, `og-image.jpg`, `favicon.svg` and all project images together. Do not create an extra enclosing folder. Back up the current site first and preserve unrelated repository files, including any custom-domain file or existing deployment workflow.

Use GitHub's **Add file → Upload files**. Prefer a new branch/pull request for review; merge when ready to publish. If your existing Pages deployment works, keep it. For simple branch-based publication, settings are **Settings → Pages → Deploy from a branch → main → /(root)**. No dependency installation, backend or build command is needed.

## Palette

| Role | Dark mode | Light mode |
| --- | --- | --- |
| Background | `#090D16` | `#F8FAFC` |
| Primary text | `#F8FAFC` | `#0F172A` |
| Emerald accent | `#10B981` | `#047857` |
| Blue support | `#3B82F6` | `#2563EB` |

Light-mode emerald is slightly darker than the old primary shade for readable links and buttons. Dark-mode small secondary text is slightly lighter for contrast. Brand hues otherwise follow the former website.

Fonts are Barlow Condensed, Plus Jakarta Sans and JetBrains Mono via Google Fonts, with system fallbacks. The site can be hosted independently of Manus. Existing external store links and YouTube embeds remain.

## Sharing image

`og-image.jpg` is 1200 × 630 px and is displayed without cropping. Open Graph and Twitter currently use a publicly accessible matching copy at `https://files.manuscdn.com/user_upload_by_module/session_file/310519663949680622/jbQeSxXPBfyOelrS.jpg`. After deployment you can optionally change both image URLs to `https://beyubabi.github.io/og-image.jpg` to keep the image in your own hosting. Canonical page address stays the original GitHub Pages origin.

## Run locally

From this folder, run `python3 -m http.server 3000`, then open `http://localhost:3000/`.

The refined layout and key interactions were previously checked at 320, 375, 768, 900, 1280 and 1440 px. This palette restoration was checked for valid styles, JavaScript syntax, image dimensions, matching sharing metadata and key color contrast. The update does not change layout or calculator behavior. Existing performance claims and testimonials were retained, not independently audited.

## Latest refinements: mobile work, service FAQs and light banner

The work section displays two cards per row on screens up to 768px, with six cards arranged in three rows. Mobile descriptions and link labels are shorter; desktop keeps its three-column layout and original descriptions. Category filtering preserves the grid naturally: one matching result displays one card, with no filler cards. Password hints remain visible on mobile store links.

The FAQ now explicitly confirms that Bayode does not only migrate websites, builds Shopify stores from beginning to end, and also builds WordPress websites and WooCommerce stores. WooCommerce runs on WordPress. The original SEO FAQ has been made more precise: redirect planning/testing supports migration, but unchanged rankings cannot be guaranteed. FAQ controls have labelled answer relationships and answers are no longer height-limited on small screens.

The portrait now has two assets: `og-image.jpg` for dark mode and `og-image-light.jpg` for light mode. Switching the site's existing Light/Dark/System setting, including the mobile quick toggle, selects the matching banner. Saved theme preference is retained. The dark version remains the social-sharing image. Upload **both** JPG files together with the updated HTML, CSS and JavaScript.

Focused checks passed at 320, 375, 430 and 768px for two-column cards, short descriptions and fitting controls. Single-result filtering, all six FAQ answers at 320px, mobile banner/theme switching, persisted light preference, desktop three-column preservation and system-theme changes were tested. No JavaScript page errors were observed.

The accepted header, tagline, client-ownership/Liquid line, service prices and calculator rules are retained. The short hero and contact copy now explicitly welcomes store builds as well as migrations. The original GitHub Pages site is still unchanged; this ZIP is ready for review and deployment when repository access is connected and deployment is authorized.
