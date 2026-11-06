import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../core/services/cart';
import { Product } from '../../../core/models/product.model';
import { optimizeCloudinaryUrl } from '../../../core/utils/cloudinary.util';
import { ToastService } from '../../services/toast.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();

  private readonly cart = inject(Cart);
  private readonly toast = inject(ToastService);
  protected readonly added = signal(false);
  protected readonly img = (url: string) => optimizeCloudinaryUrl(url, 500, '1:1');

  add(): void {
    this.cart.addItem(this.product());
    this.toast.show(`${this.product().name} se sumó a tu consulta`);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }
}
