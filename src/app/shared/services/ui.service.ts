import { Injectable, signal } from '@angular/core';

/** Estado de UI compartido: el botón flotante de WhatsApp se oculta mientras se reproduce el video (tapa sus controles). */
@Injectable({ providedIn: 'root' })
export class Ui {
  readonly fabHidden = signal(false);
}
