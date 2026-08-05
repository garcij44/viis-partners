// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Canonical URL of the deployed site. Astro uses this to generate absolute
	// URLs for sitemaps, canonical tags, and OG tags — without it those features
	// silently produce wrong/relative URLs.
	site: 'https://viispartners.com',
});
