# Marlow LoL public website

Landing page, privacy policy, terms, support and promotional artwork for Marlow LoL, operated by Mobi Media, Inc. Contact: marlow.app@gmail.com.

Published separately from the private app repository at https://retroservices1121.github.io/marlow-site/ . The app, API, authentication and invitation links remain at their existing hosts. Do not add a CNAME for marlow.lol here: moving the live app's hostname would break its routes.

## Build and publish

In the standalone public website repository, run `npm install`, `npm run build`, then `npm run check` using Node 22 or newer. The GitHub Pages workflow publishes `_site` after changes to main. Repository Settings → Pages must use GitHub Actions.

The private Project-Gas repository retains the editable source under `sites/marketing`. In that checkout, `node sites/marketing/build.cjs` uses the existing mobile fonts and approved logo. The standalone website carries only these public assets in `assets/`; no app code, user records, environment files, tokens or keys belong in it.

## Artwork

The generator produces three portrait marketing previews at 1320×2868, a 1600×600 header, a 1200×630 Open Graph/link-preview image and a 1200×1200 square image. Poppins and the approved transparent logo are reused. `assets/manifest.json` in the published site records the image sizes and usage.

The portrait images are illustrative recreations of Circles, Play and You with sample names and picks. They are not device captures or completed App Store screenshot submissions. Replace their interface area with captures from the release app before uploading to App Store Connect. Do not remove the illustrative label while the images still contain recreated UI. Apple requires screenshots to reflect the app in use: https://developer.apple.com/app-store/review/guidelines/#accurate-metadata .

## Privacy/support maintenance

`content.json` describes the current beta's behavior, including its incomplete account-deletion control. Update that paragraph only after deletion is fixed and verified. The private app renders the same text at /privacy, /terms and /support. No new analytics, advertising or forms are added by this site. Provider infrastructure logging still applies.

`site.json` owns contact, operator, publication URL and the existing external TestFlight link. No public App Store submission is performed by this project.
