import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'catalogo', renderMode: RenderMode.Server }, // los datos cambian: fresco en cada request
  { path: 'catalogo/:slug', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender }, // Home, Nosotros, Contacto, Carrito
];
