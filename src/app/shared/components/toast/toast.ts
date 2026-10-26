import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (toast.message(); as msg) { <div class="toast" role="status" aria-live="polite">{{ msg }}</div> }`,
  styles: `
    .toast { position: fixed; left: 50%; bottom: 5.5rem; transform: translateX(-50%); z-index: 400;
      background: var(--c-cream); color: var(--c-ink); padding: .7rem 1.2rem; border-left: 4px solid var(--c-gold);
      border-radius: var(--radius); font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.4); max-width: 90vw; }
  `,
})
export class Toast {
  protected readonly toast = inject(ToastService);
}
