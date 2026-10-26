import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  { path: 'catalogo', loadComponent: () => import('./features/catalog/catalog').then((m) => m.Catalog) },
  { path: 'catalogo/:slug', loadComponent: () => import('./features/product-detail/product-detail').then((m) => m.ProductDetail) },
  { path: 'carrito', loadComponent: () => import('./features/cart/cart-page').then((m) => m.CartPage) },
  { path: 'nosotros', loadComponent: () => import('./features/about/about').then((m) => m.About) },
  { path: 'contacto', loadComponent: () => import('./features/contact/contact').then((m) => m.Contact) },
  { path: '**', redirectTo: '' },
];
