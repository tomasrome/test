import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Cart } from '../../../core/services/cart';
import { SITE } from '../../../core/data/site.config';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly cart = inject(Cart);
  protected readonly site = SITE;
  protected readonly links = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/catalogo', label: 'Catálogo', exact: false },
    { path: '/nosotros', label: 'Nosotros', exact: true },
    { path: '/contacto', label: 'Contacto', exact: true },
  ];
}
