import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CONSULTING_WHATSAPP_MESSAGE, SITE } from '../../core/data/site.config';
import { Seo } from '../../core/services/seo';
import { Icon } from '../../shared/components/icon/icon';
import { InView } from '../../shared/directives/in-view';
import { PageHero } from '../../shared/components/page-hero/page-hero';

/**
 * Mapa con la EMPRESA marcada: en Google Maps buscá el negocio > Compartir > "Incorporar un mapa" > copiá el HTML
 * y pegá acá SOLO el valor de src="..." (empieza con https://www.google.com/maps/embed?pb=...).
 * Si queda vacío, se usa la búsqueda por dirección (SITE.mapQuery en site.config.ts).
 */
const MAP_EMBED_URL = '';

@Component({
  selector: 'app-contact',
  imports: [Icon, InView, PageHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly seo = inject(Seo);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly site = SITE;
  protected readonly waLink = `https://wa.me/${SITE.whatsapp}`;
  protected readonly scriptLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(CONSULTING_WHATSAPP_MESSAGE)}`;
  protected readonly mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    MAP_EMBED_URL ||
      `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`,
  );

  ngOnInit(): void {
    this.seo.set({
      title: 'Contacto',
      description:
        'Escribinos por WhatsApp o email, visitanos en Bernal Oeste, Buenos Aires, o consultanos por la asesoría de escenas médicas para tu guión.',
      path: '/contacto',
    });
  }
}
