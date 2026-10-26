import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONSULTING_WHATSAPP_MESSAGE, SITE } from '../../core/data/site.config';
import { TEAM } from '../../core/data/team';
import { Seo } from '../../core/services/seo';
import { Icon } from '../../shared/components/icon/icon';
import { InView } from '../../shared/directives/in-view';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-about',
  imports: [RouterLink, Icon, InView, SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private readonly seo = inject(Seo);
  protected readonly team = TEAM;
  protected readonly consultingLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(CONSULTING_WHATSAPP_MESSAGE)}`;

  ngOnInit(): void {
    this.seo.set({
      title: 'Nosotros',
      description: 'Conocé al equipo de El Gato Tuerto: una licenciada en artes audiovisuales, un técnico y una médica al servicio de tu rodaje.',
      path: '/nosotros',
    });
  }
}
