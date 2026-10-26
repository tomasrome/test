import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { PRODUCT_REPOSITORY } from '../../core/tokens/product-repository.token';
import { Product } from '../../core/models/product.model';
import { Cart } from '../../core/services/cart';
import { Seo } from '../../core/services/seo';
import { generateSlug } from '../../core/utils/slug.util';
import { optimizeCloudinaryUrl } from '../../core/utils/cloudinary.util';
import { Icon } from '../../shared/components/icon/icon';
import { Spinner } from '../../shared/components/spinner/spinner';
import { ToastService } from '../../shared/services/toast.service';

interface Loaded { done: boolean; product?: Product }

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, Icon, Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly repo = inject(PRODUCT_REPOSITORY);
  private readonly seo = inject(Seo);
  private readonly cart = inject(Cart);
  private readonly toast = inject(ToastService);

  protected readonly state = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('slug') ?? ''),
      switchMap((slug) => this.repo.getProductBySlug(slug)),
      map((product): Loaded => ({ done: true, product })),
      tap(({ product }) => this.setSeo(product)),
    ),
    { initialValue: { done: false } as Loaded },
  );

  protected readonly added = signal(false);
  protected readonly categorySlug = computed(() => generateSlug(this.state().product?.category ?? ''));

  /** Si la descripción trae viñetas "•", se separa en intro + lista. */
  protected readonly description = computed(() => {
    const lines = (this.state().product?.description ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    return {
      paragraphs: lines.filter((l) => !l.startsWith('•')),
      bullets: lines.filter((l) => l.startsWith('•')).map((l) => l.replace(/^•\s*/, '')),
    };
  });

  protected readonly big = (url: string) => optimizeCloudinaryUrl(url, 800);

  add(product: Product): void {
    this.cart.addItem(product);
    this.toast.show(`${product.name} se sumó a tu consulta`);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }

  private setSeo(product?: Product): void {
    if (!product) {
      this.seo.set({ title: 'Equipo no encontrado', description: 'Este equipo no está disponible en el catálogo.', path: '/catalogo' });
      return;
    }
    this.seo.set({
      title: product.name,
      description: product.description.replace(/\s+/g, ' ').slice(0, 155) || `Alquiler de ${product.name} para producciones audiovisuales.`,
      path: `/catalogo/${product.slug}`,
      image: product.imageUrl ? optimizeCloudinaryUrl(product.imageUrl, 1200) : undefined,
    });
  }
}
