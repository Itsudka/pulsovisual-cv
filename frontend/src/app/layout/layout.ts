import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { filter } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly activatedRoute =
    inject(ActivatedRoute);


  // ==========================
  // USUARIO
  // ==========================

  readonly currentUser =
    this.authService.currentUser;


  // ==========================
  // INFORMACION DE PAGINA
  // ==========================

  readonly pageTitle =
    signal('Dashboard');

  readonly pageSubtitle =
    signal('Visualiza la actividad de tus sectores');


  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor() {
    this.updatePageInformation();

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        this.updatePageInformation();
      });
  }


  // ==========================
  // ACTUALIZAR ENCABEZADO
  // ==========================

  private updatePageInformation(): void {
    let route: ActivatedRoute | null =
      this.activatedRoute;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    // ==========================
    // DATOS DE LA RUTA
    // ==========================

    const data =
      route?.snapshot?.data ?? {};


    // ==========================
    // TITULO
    // ==========================

    this.pageTitle.set(
      data['title'] ?? 'Dashboard',
    );


    // ==========================
    // SUBTITULO
    // ==========================

    this.pageSubtitle.set(
      data['subtitle'] ??
        'Visualiza la actividad de tus sectores',
    );
  }


  // ==========================
  // CERRAR SESION
  // ==========================

  logout(): void {
    this.authService.logout();

    this.router.navigate([
      '/login',
    ]);
  }
}
