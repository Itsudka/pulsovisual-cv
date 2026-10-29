import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Sectors } from './sectors/sectors';
import { Layout } from './layout/layout';
import { NewAnalysis } from './new-analysis/new-analysis';
import {History,} from './history/history';

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

      {
        path: 'sectors',
        component: Sectors,
        data: {
          title: 'Sectores',
          subtitle: 'Administra los espacios de análisis',
        },
      },

      {
        path: 'new-analysis',
        component: NewAnalysis,
        data: {
          title: 'Nuevo análisis',
          subtitle:
            'Carga un video, asígnalo a un sector y configura el procesamiento',
        },
      },

      {
        path: 'history',
        component: History,
        data: {
          title: 'Historial',
          subtitle:
            'Consulta y compara los análisis realizados',
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
