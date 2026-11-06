import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../../core/data/site.config';
import { Ui } from '../../services/ui.service';

@Component({
  selector: 'app-whatsapp-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.scss',
})
export class WhatsappButton {
  protected readonly ui = inject(Ui);
  protected readonly href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('')}`;
}
