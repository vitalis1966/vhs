export async function generateSitemap(supabase: any, siteUrl: string): Promise<string> {
  const { data: pages } = await supabase
    .from('seo_pages')
    .select('route, robots, updated_at')
    .eq('is_active', true)

  const today = new Date().toISOString().split('T')[0]

  const publicPages = (pages || []).filter((p: any) =>
    !p.route.startsWith('/admin') &&
    !['noindex'].some(n => p.robots?.includes(n))
  )

  const priorityMap: Record<string, string> = {
    '/': '1.0',
    '/solutions/new-clinics': '0.9',
    '/solutions/existing-clinics': '0.9',
    '/solutions': '0.9',
    '/contact': '0.8',
    '/strategic-assessment': '0.8',
    '/about': '0.8',
    '/how-we-work': '0.8',
  }

  const changefreqMap: Record<string, string> = {
    '/': 'weekly',
    '/insights': 'weekly',
  }

  const urls = publicPages.map((p: any) => `  <url>
    <loc>${siteUrl}${p.route === '/' ? '' : p.route}/</loc>
    <lastmod>${p.updated_at ? p.updated_at.split('T')[0] : today}</lastmod>
    <changefreq>${changefreqMap[p.route] || 'monthly'}</changefreq>
    <priority>${priorityMap[p.route] || '0.7'}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
