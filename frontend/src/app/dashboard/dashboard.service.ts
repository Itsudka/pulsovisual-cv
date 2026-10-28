import {
  HttpClient,
} from '@angular/common/http';

import {
  inject,
  Injectable,
} from '@angular/core';
import { DashboardActivity, DashboardHourly, DashboardSector, DashboardSummary } from './interfaces/dashboard.models';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly http =
    inject(HttpClient);


  // ==========================
  // CONFIGURACION
  // ==========================

  private readonly apiUrl =
    `${environment.apiUrl}/dashboard`;

  // ==========================
  // RESUMEN
  // ==========================

  getSummary() {
    return this.http.get<DashboardSummary>(
      `${this.apiUrl}/summary`,
    );
  }


  // ==========================
  // ACTIVIDAD POR FECHA
  // ==========================

  getActivity() {
    return this.http.get<DashboardActivity[]>(
      `${this.apiUrl}/activity`,
    );
  }


  // ==========================
  // ACTIVIDAD POR SECTOR
  // ==========================

  getSectors() {
    return this.http.get<DashboardSector[]>(
      `${this.apiUrl}/sectors`,
    );
  }


  // ==========================
  // ACTIVIDAD POR HORA
  // ==========================

  getHourly() {
    return this.http.get<DashboardHourly>(
      `${this.apiUrl}/hourly`,
    );
  }
}
