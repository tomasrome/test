import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MOTION, PROMO_VIDEO } from '../../../core/data/site.config';
import { Ui } from '../../services/ui.service';
import { Icon } from '../icon/icon';

/**
 * Video institucional a todo el ancho, en modo "ambiente": arranca solo, sin sonido y en loop.
 * - Solo se reproduce mientras la sección está en pantalla (ahorra datos y CPU); al irse se pausa.
 * - Controles nativos disponibles para activar el sonido, pausar o ver en pantalla completa.
 * - Con "reducir animaciones" o "ahorro de datos" no arranca solo: portada con botón de play.
 *   (ese play, al ser una acción explícita, reproduce con sonido y sin loop).
 * - En celular en vertical usa la versión vertical si está configurada (PROMO_VIDEO.srcVertical).
 */
@Component({
  selector: 'app-promo-video',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promo-video.html',
  styleUrl: './promo-video.scss',
})
export class PromoVideo implements OnDestroy {
  protected readonly cfg = PROMO_VIDEO;
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private readonly ui = inject(Ui);

  protected readonly ready = signal(false); // ya corrió en el browser
  protected readonly autoplay = signal(false); // se permite arrancar solo
  protected readonly blocked = signal(false); // el navegador bloqueó el autoplay
  protected readonly started = signal(false); // está reproduciendo (o ya lo hizo)
  protected readonly failed = signal(false);
  protected readonly vertical = signal(false);
  private readonly inView = signal(false);

  protected readonly src = computed(() => (this.vertical() ? this.cfg.srcVertical : this.cfg.src));
  protected readonly poster = computed(() =>
    this.vertical() ? this.cfg.posterVertical : this.cfg.poster,
  );
  /** Portada con botón de play: solo cuando NO va a arrancar sola. */
  protected readonly showCover = computed(
    () => this.ready() && !this.started() && (!this.autoplay() || this.blocked()),
  );

  private mq?: MediaQueryList;
  private io?: IntersectionObserver;
  private userPaused = false; // la persona lo pausó con los controles: no se reanuda solo
  private systemPause = false; // pausa automática al salir de pantalla
  private readonly onChange = () => {
    // si ya empezó a reproducirse no se cambia de archivo a mitad
    if (!this.started()) this.vertical.set(!!this.cfg.srcVertical && !!this.mq?.matches);
  };

  constructor() {
    // el botón flotante de WhatsApp tapa los controles del video: se oculta mientras está a la vista
    /* effect(() => this.ui.fabHidden.set(this.started() && this.inView())); */

    afterNextRender(() => {
      this.mq = window.matchMedia('(max-width: 700px) and (orientation: portrait)');
      this.onChange();
      this.mq.addEventListener('change', this.onChange);

      const reduced =
        MOTION.respectReducedMotion &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData;
      this.autoplay.set(!reduced && !saveData);
      this.ready.set(true);

      this.io = new IntersectionObserver(([entry]) => this.onVisibility(entry.isIntersecting), {
        threshold: 0.25,
      });
      this.io.observe(this.frame().nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.mq?.removeEventListener('change', this.onChange);
    this.io?.disconnect();
    this.ui.fabHidden.set(false);
  }

  /** Play manual (portada): acción explícita → con sonido y sin loop. */
  protected play(): void {
    const v = this.video().nativeElement;
    this.failed.set(false);
    this.blocked.set(false);
    this.userPaused = false;
    v.muted = false;
    v.loop = false;
    v.play().catch(() => this.blocked.set(true));
  }
  /** El botón flotante de WhatsApp tapa los controles del video: solo se oculta mientras el mouse está encima. */
  protected onHover(over: boolean, event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.ui.fabHidden.set(over && this.started());
  }

  protected onPlay(): void {
    this.started.set(true);
    this.userPaused = false;
  }

  protected onPause(): void {
    if (this.systemPause) {
      this.systemPause = false;
      return;
    }
    if (!this.video().nativeElement.ended) this.userPaused = true;
  }

  /** Sin loop (play manual): al terminar vuelve a la portada. */
  protected onEnded(): void {
    this.started.set(false);
    const v = this.video().nativeElement;
    v.muted = true;
    v.loop = true;
    v.load();
    this.blocked.set(true); // muestra la portada para poder repetirlo
  }

  protected onError(): void {
    this.started.set(false);
    this.blocked.set(true);
    this.failed.set(true);
  }

  private onVisibility(visible: boolean): void {
    this.inView.set(visible);
    const v = this.video().nativeElement;
    if (visible) {
      if (this.autoplay() && !this.blocked() && !this.userPaused && v.paused) {
        v.muted = true;
        v.play().catch(() => this.blocked.set(true)); // autoplay bloqueado → portada con play
      }
    } else if (!v.paused) {
      this.systemPause = true;
      v.pause();
    }
  }
}
