import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MOTION } from '../../../core/data/site.config';
import { Production } from '../../../core/models/production.model';
import { optimizeCloudinaryUrl } from '../../../core/utils/cloudinary.util';

/**
 * Carrusel infinito: se mueve solo (translateX por requestAnimationFrame), repite la lista
 * duplicándola y se pausa con el mouse / foco.
 */
@Component({
  selector: 'app-poster-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './poster-carousel.html',
  styleUrl: './poster-carousel.scss',
})
export class PosterCarousel implements OnDestroy {
  readonly items = input.required<Production[]>();
  readonly speed = input(74); // px por segundo

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** En el servidor se renderiza 1 sola copia; las demás se agregan en el browser. */
  /** true = movimiento reducido: no se mueve solo, se recorre a mano con scroll/arrastre. */
  protected readonly manual = signal(false);
  protected readonly copies = signal(1);
  protected readonly sets = computed(() => Array.from({ length: this.copies() }, (_, i) => i));
  protected readonly poster = (url: string) => optimizeCloudinaryUrl(url, 400, '2:3');

  private pos = 0;
  private loopWidth = 0;
  private last = 0;
  private raf = 0;
  private paused = false;
  private visible = true;
  private io?: IntersectionObserver;
  private readonly onResize = () => (this.loopWidth = 0);

  constructor() {
    afterNextRender(() => this.start());
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.io?.disconnect();
  }

  protected pause(value: boolean): void {
    this.paused = value;
  }

  protected onPointer(event: PointerEvent, over: boolean): void {
    if (event.pointerType === 'mouse') this.paused = over; // en touch no se "pega" el hover
  }

  private start(): void {
    if (
      MOTION.respectReducedMotion &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.manual.set(true);
      return;
    }
    this.copies.set(2);
    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting));
    this.io.observe(this.viewport().nativeElement);
    window.addEventListener('resize', this.onResize);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  /** Ancho de una vuelta completa = distancia entre el 1.er póster y su copia. */
  private measure(): void {
    const n = this.items().length;
    const kids = this.rail().nativeElement.children;
    if (n === 0 || kids.length < n * 2) return; // las copias todavía no se renderizaron
    const loop = (kids[n] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft;
    if (loop <= 0) return;
    this.loopWidth = loop;
    const needed = Math.ceil(this.viewport().nativeElement.clientWidth / loop) + 1;
    if (needed > this.copies()) this.copies.set(needed); // pocas películas: más copias para no dejar huecos
  }

  private readonly tick = (now: number): void => {
    const dt = Math.min(now - this.last, 64);
    this.last = now;
    if (!this.loopWidth) this.measure();

    if (this.loopWidth && this.visible) {
      if (!this.paused) this.pos += (this.speed() * dt) / 1000;
      this.pos = ((this.pos % this.loopWidth) + this.loopWidth) % this.loopWidth;
      this.rail().nativeElement.style.transform = `translate3d(${-this.pos}px,0,0)`;
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
