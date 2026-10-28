import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { inject } from '@angular/core';

import { AuthService } from './auth.service';


// ==========================
// GUARD DE AUTENTICACION
// ==========================

export const authGuard: CanActivateFn = () => {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  const authService = inject(AuthService);

  const router = inject(Router);


  // ==========================
  // USUARIO AUTENTICADO
  // ==========================

  if (authService.isAuthenticated()) {
    return true;
  }


  // ==========================
  // REDIRECCION AL LOGIN
  // ==========================

  return router.createUrlTree([
    '/login',
  ]);
};
