import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PRODUCT_REPOSITORY } from './core/tokens/product-repository.token';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { CartDrawer } from './shared/components/cart-drawer/cart-drawer';
import { WhatsappButton } from './shared/components/whatsapp-button/whatsapp-button';
import { Toast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, CartDrawer, WhatsappButton, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Prefetch solo en browser: en el servidor bloquea la estabilización del SSR.
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      inject(PRODUCT_REPOSITORY).getProducts().subscribe();
    }
  }
}
