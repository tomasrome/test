import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, retry, shareReplay, tap, timeout, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ProductRepository } from '../tokens/product-repository.token';
import { generateSlug } from '../utils/slug.util';
import { SAMPLE_PRODUCTS } from '../data/sample-products';

const CACHE_DURATION_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;
const RETRY_COUNT = 2;
const RETRY_DELAY_MS = 1000;
const ERROR_RETRY_MS = 30_000;
const STORAGE_KEY = 'gt-products-cache-v2';
const STORAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class GoogleSheetsProductAdapter implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private cache$?: Observable<Product[]>;
  private cacheTimestamp = 0;
  private lastGood: Product[] | null = null;

  getProducts(): Observable<Product[]> {
    if (!environment.apiUrl) return of(SAMPLE_PRODUCTS);

    const now = Date.now();
    if (!this.cache$ || now - this.cacheTimestamp > CACHE_DURATION_MS) {
      this.cacheTimestamp = now;
      this.lastGood ??= this.readStorage();
      this.cache$ = this.http.get<Record<string, unknown>[]>(environment.apiUrl).pipe(
        timeout(REQUEST_TIMEOUT_MS),
        retry({ count: RETRY_COUNT, delay: () => timer(RETRY_DELAY_MS) }),
        map((rows) => rows.map((r) => this.mapToProduct(r))),
        tap((products) => {
          this.lastGood = products;
          this.writeStorage(products);
        }),
        catchError((err) => {
          console.warn('Fallo al traer productos:', err);
          // reintenta en 30 s en lugar de esperar los 5 min completos
          this.cacheTimestamp = now - CACHE_DURATION_MS + ERROR_RETRY_MS;
          return of(this.lastGood ?? []);
        }),
        shareReplay(1),
      );
    }
    return this.cache$;
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getProducts().pipe(map((products) => products.find((p) => p.slug === slug)));
  }

  private mapToProduct(r: Record<string, unknown>): Product {
    const name = String(r['nombre'] ?? '');
    const rawStock = r['stock'];
    const stock = rawStock === '' || rawStock === null || rawStock === undefined ? null : Number(rawStock);
    return {
      id: String(r['id'] ?? ''),
      name,
      slug: generateSlug(name),
      category: String(r['categoria'] ?? ''),
      description: String(r['descripcion'] ?? ''),
      imageUrl: String(r['imagen'] ?? ''),
      categoryOrder: Number.isFinite(Number(r['ordenCategoria'])) && r['ordenCategoria'] !== '' && r['ordenCategoria'] != null ? Number(r['ordenCategoria']) : 999,
      stock: stock !== null && Number.isFinite(stock) ? stock : null,
      discount: Math.max(0, Number(r['descuento']) || 0),
    };
  }

  private readStorage(): Product[] | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const { products, savedAt } = JSON.parse(raw) as { products: Product[]; savedAt: number };
      return Date.now() - savedAt > STORAGE_MAX_AGE_MS ? null : products;
    } catch {
      return null;
    }
  }

  private writeStorage(products: Product[]): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, savedAt: Date.now() }));
    } catch {
      /* storage lleno o bloqueado: no es crítico */
    }
  }
}
