import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PRODUCT_REPOSITORY } from '../../core/tokens/product-repository.token';
import { Product } from '../../core/models/product.model';
import { Seo } from '../../core/services/seo';
import { SITE } from '../../core/data/site.config';
import { generateSlug } from '../../core/utils/slug.util';
import { optimizeCloudinaryUrl } from '../../core/utils/cloudinary.util';
import { Icon } from '../../shared/components/icon/icon';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Spinner } from '../../shared/components/spinner/spinner';

interface Category {
  name: string;
  slug: string;
  count: number;
  cover: string;
}

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, Icon, ProductCard, SectionHeading, Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit {
  private readonly seo = inject(Seo);
  private readonly route = inject(ActivatedRoute);
  protected readonly pdf = SITE.catalogPdf;

  private readonly products = toSignal<Product[] | null>(inject(PRODUCT_REPOSITORY).getProducts(), { initialValue: null });
  private readonly categorySlug = toSignal(this.route.queryParamMap.pipe(map((q) => q.get('categoria'))), {
    initialValue: this.route.snapshot.queryParamMap.get('categoria'),
  });

  protected readonly loading = computed(() => this.products() === null);

  /** Derivadas de los productos: si el cliente carga una categoría nueva, aparece sola. */
  protected readonly categories = computed<Category[]>(() => {
    const map = new Map<string, Category>();
    for (const p of this.products() ?? []) {
      if (!p.category) continue;
      const existing = map.get(p.category);
      if (existing) {
        existing.count++;
        if (!existing.cover) existing.cover = p.imageUrl;
      } else {
        map.set(p.category, { name: p.category, slug: generateSlug(p.category), count: 1, cover: p.imageUrl });
      }
    }
    return [...map.values()];
  });

  protected readonly selectedIndex = computed(() => this.categories().findIndex((c) => c.slug === this.categorySlug()));
  protected readonly selected = computed(() => this.categories()[this.selectedIndex()] ?? null);
  protected readonly prev = computed(() => this.neighbor(-1));
  protected readonly next = computed(() => this.neighbor(1));

  protected readonly visibleProducts = computed(() => {
    const cat = this.selected();
    return cat ? (this.products() ?? []).filter((p) => p.category === cat.name) : [];
  });

  protected readonly cover = (url: string) => optimizeCloudinaryUrl(url, 600, '4:3');

  ngOnInit(): void {
    this.seo.set({
      title: 'Catálogo de equipamiento médico',
      description: 'Camas, camillas, monitores, bombas de infusión y más equipamiento médico para alquilar para tu rodaje.',
      path: '/catalogo',
    });
  }

  private neighbor(step: number): Category | null {
    const list = this.categories();
    const i = this.selectedIndex();
    if (i < 0 || list.length < 2) return null;
    return list[(i + step + list.length) % list.length];
  }
}
