import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'gt-cart-v1';

@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly items = signal<CartItem[]>([]);
  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  readonly isDrawerOpen = signal(false);

  constructor() {
    this.items.set(this.load());
  }

  addItem(product: Product): void {
    this.items.update((list) => {
      const found = list.find((i) => i.product.id === product.id);
      return found
        ? list.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...list, { product, quantity: 1 }];
    });
    this.save();
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) return this.removeItem(id);
    this.items.update((list) => list.map((i) => (i.product.id === id ? { ...i, quantity } : i)));
    this.save();
  }

  removeItem(id: string): void {
    this.items.update((list) => list.filter((i) => i.product.id !== id));
    this.save();
  }

  clear(): void {
    this.items.set([]);
    this.save();
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }
  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }
  toggleDrawer(): void {
    this.isDrawerOpen.update((v) => !v);
  }

  /** Texto plano de los equipos, para guardar el lead. */
  summary(): string {
    return this.items()
      .map((i) => `${i.product.name} x${i.quantity}`)
      .join(', ');
  }

  generateWhatsAppLink(phone: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(this.buildMessage())}`;
  }

  generateMailtoLink(email: string): string {
    const subject = 'Consulta de alquiler de equipos';
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.buildShortMessage())}`;
  }

  private buildMessage(): string {
    const lines = this.items().map((i, n) => `${n + 1}. ${i.product.name} x${i.quantity}`);
    return [
      'Hola! Quisiera consultar por el alquiler de los siguientes equipos:',
      '',
      ...lines,
      '',
      'Mis datos:',
      'Nombre y apellido: ',
      'Producción / proyecto: ',
      'Fechas de rodaje: ',
      '',
      'Muchas gracias!',
    ].join('\n');
  }

  // Los mailto largos fallan: mensaje corto.
  private buildShortMessage(): string {
    return `Hola! Quisiera consultar por: ${this.summary()}.\n\nNombre: \nProducción: \nFechas de rodaje: `;
  }

  private load(): CartItem[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    } catch {
      /* no es crítico */
    }
  }
}
