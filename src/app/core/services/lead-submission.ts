import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lead {
  tipo: string;
  nombre?: string;
  email?: string;
  detalle?: string;
}

@Injectable({ providedIn: 'root' })
export class LeadSubmission {
  private readonly http = inject(HttpClient);

  /** Fire-and-forget: nunca bloquea ni rompe la navegación a WhatsApp/mail. */
  submit(lead: Lead): void {
    if (!environment.apiUrl) return;
    this.http
      .post(environment.apiUrl, JSON.stringify(lead), {
        headers: { 'Content-Type': 'text/plain' }, // evita el preflight CORS
        responseType: 'text',
      })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }
}
