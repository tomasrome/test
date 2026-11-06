import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Cabecera clara de las pantallas internas (Nosotros, Contacto): mismo lenguaje visual que el hero del Home. */
@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss',
})
export class PageHero {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  /** 'dark' = fondo oscuro (mismo slate del catálogo); 'light' = crema (Nosotros, Contacto). */
  readonly theme = input<'light' | 'dark'>('light');
}
