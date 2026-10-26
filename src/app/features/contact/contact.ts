import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CONSULTING_WHATSAPP_MESSAGE, SITE } from '../../core/data/site.config';
import { Seo } from '../../core/services/seo';
import { Icon } from '../../shared/components/icon/icon';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-contact',
  imports: [Icon, SectionHeading],
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
    `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`,
  );

  ngOnInit(): void {
    this.seo.set({
      title: 'Contacto',
      description: 'Escribinos por WhatsApp o email, o visitanos en Bernal Oeste, Buenos Aires.',
      path: '/contacto',
    });
  }
}
