// Función serverless de Vercel. Variable de entorno requerida: PRODUCTS_API_URL
export default async function handler(_req: any, res: any) {
  const BASE = 'https://gatotuerto.com.ar'; // misma variante (sin www) que BASE_URL en site.config.ts
  let products: any[] = [];
  try {
    const r = await fetch(process.env['PRODUCTS_API_URL']!);
    products = await r.json();
  } catch {
    /* si falla el Sheet, igual servimos las rutas estáticas */
  }
  // misma lógica que generateSlug() en la app
  const slug = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

  const staticPaths = ['', 'catalogo', 'nosotros', 'contacto'];
  const urls = [
    ...staticPaths.map(
      (p) => `<url><loc>${BASE}/${p}</loc><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`,
    ),
    ...products.map(
      (p) => `<url><loc>${BASE}/catalogo/${slug(p.nombre)}</loc><changefreq>daily</changefreq><priority>0.6</priority></url>`,
    ),
  ].join('');

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
}
