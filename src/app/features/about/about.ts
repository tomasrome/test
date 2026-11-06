import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SITE } from '../../core/data/site.config';
import { TEAM } from '../../core/data/team';
import { Seo } from '../../core/services/seo';
import { InView } from '../../shared/directives/in-view';
import { PageHero } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-about',
  imports: [InView, PageHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private readonly seo = inject(Seo);
  protected readonly team = TEAM;
  protected readonly site = SITE;

  ngOnInit(): void {
    this.seo.set({
      title: 'Nosotros',
      description: 'Conocé al equipo de El Gato Tuerto: una licenciada en artes audiovisuales, un técnico y una médica al servicio de tu rodaje.',
      path: '/nosotros',
    });
  }
}
