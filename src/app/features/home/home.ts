import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HERO_VIDEOS, MOTION, PROMO_VIDEO, SITE } from '../../core/data/site.config';
import { PRODUCTIONS } from '../../core/data/productions';
import { Seo } from '../../core/services/seo';
import { InView } from '../../shared/directives/in-view';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { PosterCarousel } from '../../shared/components/poster-carousel/poster-carousel';
import { PromoVideo } from '../../shared/components/promo-video/promo-video';

const LAST_VIDEO_KEY = 'gt-last-hero-video';

@Component({
  selector: 'app-home',
  imports: [InView, Icon, PosterCarousel, PromoVideo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly seo = inject(Seo);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly site = SITE;
  protected readonly promo = PROMO_VIDEO;
  protected readonly productions = PRODUCTIONS;
  protected readonly features: { icon: IconName; label: string }[] = [
    { icon: 'bell-off', label: 'Sin alarmas' },
    { icon: 'lock', label: 'Sin complicaciones' },
    { icon: 'shield-check', label: 'Equipos verificados' },
    { icon: 'clapper', label: 'Listos para rodar' },
  ];

  /** El video se elige en el browser (distinto en cada visita) para no romper la hidratación. */
  protected readonly hero = signal(HERO_VIDEOS[0]);
  protected readonly playVideo = signal(false);
  protected readonly ready = signal(false);

  constructor() {
    afterNextRender(() => this.pickVideo());
  }

  ngOnInit(): void {
    this.seo.set({
      title: 'Rental de equipamiento médico para producciones',
      description:
        'Equipamiento médico acondicionado para rodajes, sin alarma, y asesoría de escenas médicas para guiones.',
      path: '/',
    });
  }

  /** Play manual: se usa cuando el autoplay está desactivado (ahorro de datos / movimiento reducido). */
  protected start(): void {
    this.playVideo.set(true);
  }

  private pickVideo(): void {
    if (!this.isBrowser) return;
    const reduced =
      MOTION.respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;

    let last = -1;
    try {
      last = Number(localStorage.getItem(LAST_VIDEO_KEY) ?? -1);
    } catch {
      /* sin storage */
    }
    const options = HERO_VIDEOS.map((_, i) => i).filter((i) => i !== last);
    const next = options[Math.floor(Math.random() * options.length)];
    try {
      localStorage.setItem(LAST_VIDEO_KEY, String(next));
    } catch {
      /* sin storage */
    }

    this.hero.set(HERO_VIDEOS[next]);
    this.playVideo.set(!reduced && !saveData);
    this.ready.set(true);
  }
}
