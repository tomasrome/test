import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE } from '../../../core/data/site.config';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-whatsapp-button',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.scss',
})
export class WhatsappButton {
  protected readonly href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola! Quisiera hacer una consulta.')}`;
}
