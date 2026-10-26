import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../../core/services/cart';
import { optimizeCloudinaryUrl } from '../../../core/utils/cloudinary.util';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-cart-drawer',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawer {
  protected readonly cart = inject(Cart);
  private readonly router = inject(Router);
  protected readonly thumb = (url: string) => optimizeCloudinaryUrl(url, 120, '1:1');

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cart.closeDrawer();
  }

  goToCart(): void {
    this.cart.closeDrawer();
    this.router.navigateByUrl('/carrito');
  }
}
