import type { Config } from '@react-router/dev/config'
import { pages } from './app/content/paths'

// Static HTML per route (SEO), uploaded over FTP like the Vue site.
// Unknown URLs fall back to __spa-fallback.html, which renders NotFound / the root ErrorBoundary.
export default {
  ssr: false,
  prerender: [...pages, '/sitemap.xml'],
} satisfies Config
