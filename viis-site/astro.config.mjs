// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Canonical URL of the deployed site. Astro uses this to generate absolute
	// URLs for sitemaps, canonical tags, and OG tags — without it those features
	// silently produce wrong/relative URLs.
	site: 'https://viispartners.com',
	build: {
		// WHY: keep every stylesheet and script an external, same-origin file so
		// the strict Content-Security-Policy (script-src/style-src 'self', no
		// 'unsafe-inline') in staticwebapp.config.json holds. 'auto' would inline
		// small assets as <style>/<script>, which the CSP would then block.
		inlineStylesheets: 'never',
	},
});
