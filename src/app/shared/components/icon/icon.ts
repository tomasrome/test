import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'whatsapp' | 'mail' | 'instagram' | 'cart' | 'trash' | 'plus' | 'minus' | 'download'
  | 'pin' | 'close' | 'arrow-left' | 'arrow-right' | 'check' | 'bell-off' | 'clapper' | 'lock' | 'shield-check' | 'play';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @switch (name()) {
        @case ('whatsapp') { <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6L3 21z"/><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.3-1.2-1.8-1-.8.6a3.6 3.6 0 0 1-1.6-1.6l.6-.8-1-1.8L9 9.5z"/> }
        @case ('mail') { <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/> }
        @case ('instagram') { <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/> }
        @case ('cart') { <path d="M3 4h2.5l2 11h10.2l2-8H6.5"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/> }
        @case ('trash') { <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/> }
        @case ('plus') { <path d="M12 5v14M5 12h14"/> }
        @case ('minus') { <path d="M5 12h14"/> }
        @case ('download') { <path d="M12 4v11M7 11l5 5 5-5M5 20h14"/> }
        @case ('pin') { <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/> }
        @case ('close') { <path d="M6 6l12 12M18 6L6 18"/> }
        @case ('arrow-left') { <path d="M15 5l-7 7 7 7"/> }
        @case ('arrow-right') { <path d="M9 5l7 7-7 7"/> }
        @case ('check') { <path d="M5 12.5l4.5 4.5L19 7.5"/> }
        @case ('bell-off') { <path d="M6 16V11a6 6 0 0 1 8.5-5.4M18 11v5l2 2H5M10 21h4M3 3l18 18"/> }
        @case ('lock') { <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/> }
        @case ('shield-check') { <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/> }
        @case ('play') { <path d="M8 5v14l11-7z" fill="currentColor"/> }
        @case ('clapper') { <path d="M4 9h16v11H4zM4 9l2-5 4 1-2 4M10 5l4 1-2 4M14 6l4 1-2 3"/> }
      }
    </svg>
  `,
  styles: `:host { display: inline-flex; line-height: 0; }`,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(22);
}
