import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="spin" role="status" aria-label="Cargando"></div>`,
  styles: `
    :host { display: grid; place-items: center; padding: 3rem; }
    .spin { width: 42px; height: 42px; border: 4px solid rgba(201,166,58,.25); border-top-color: var(--c-gold); border-radius: 50%; animation: s .8s linear infinite; }
    @keyframes s { to { transform: rotate(360deg); } }
  `,
})
export class Spinner {}
