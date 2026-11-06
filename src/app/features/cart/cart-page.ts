import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { LeadSubmission } from '../../core/services/lead-submission';
import { Seo } from '../../core/services/seo';
import { SITE } from '../../core/data/site.config';
import { optimizeCloudinaryUrl } from '../../core/utils/cloudinary.util';
import { Icon } from '../../shared/components/icon/icon';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, Icon, PageHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage implements OnInit, OnDestroy {
  protected readonly cart = inject(Cart);
  private readonly leads = inject(LeadSubmission);
  private readonly toast = inject(ToastService);
  private readonly seo = inject(Seo);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly isMobile = signal(false);
  protected readonly thumb = (url: string) => optimizeCloudinaryUrl(url, 200, '1:1');
  private readonly onResize = () => this.isMobile.set(window.innerWidth <= 700);

  ngOnInit(): void {
    this.seo.set({
      title: 'Carrito de consulta',
      description: 'Armá tu consulta de alquiler y envianosla por WhatsApp.',
      path: '/carrito',
    });
    if (this.isBrowser) {
      this.onResize();
      window.addEventListener('resize', this.onResize);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) window.removeEventListener('resize', this.onResize);
  }

  sendWhatsApp(): void {
    // La navegación va primero y síncrona; los efectos secundarios después, sin await.
    window.open(this.cart.generateWhatsAppLink(SITE.whatsapp), '_blank', 'noopener');
    this.leads.submit({ tipo: 'consulta-whatsapp', detalle: this.cart.summary() });
    this.toast.show('Te abrimos WhatsApp con tu consulta');
  }

  sendEmail(): void {
    window.location.href = this.cart.generateMailtoLink(SITE.email);
    this.leads.submit({ tipo: 'consulta-email', detalle: this.cart.summary() });
  }
}
