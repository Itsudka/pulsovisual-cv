import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  // ==========================
  // LOGIN
  // ==========================

  {
    path: 'login',
    component: Login,
  },


  // ==========================
  // APLICACION
  // ==========================

  {
    path: '',
    component: Layout,
    canActivate: [
      authGuard,
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        component: Dashboard,
        data: {
          title: 'Dashboard',
          subtitle: 'Visualiza la actividad de tus sectores',
        },
      },
    ],
  },


  // ==========================
  // RUTA DESCONOCIDA
  // ==========================

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
