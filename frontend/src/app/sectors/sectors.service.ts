import {
  HttpClient,
} from '@angular/common/http';

import {
  inject,
  Injectable,
} from '@angular/core';

import {
  environment,
} from '../../environments/environment';
import { CreateSectorRequest, Sector, UpdateSectorRequest,   SectorAnalytics, } from './interfaces/sectors.models';




@Injectable({
  providedIn: 'root',
})
export class SectorsService {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly http =
    inject(HttpClient);


  // ==========================
  // CONFIGURACION
  // ==========================

  private readonly apiUrl =
    `${environment.apiUrl}/sectors`;


  // ==========================
  // LISTAR SECTORES
  // ==========================

  getAll() {
    return this.http.get<Sector[]>(
      this.apiUrl,
    );
  }


  // ==========================
  // CREAR SECTOR
  // ==========================

  create(
    sector: CreateSectorRequest,
  ) {
    return this.http.post<Sector>(
      this.apiUrl,
      sector,
    );
  }


  // ==========================
  // ACTUALIZAR SECTOR
  // ==========================

  update(
    id: number,
    sector: UpdateSectorRequest,
  ) {
    return this.http.patch<Sector>(
      `${this.apiUrl}/${id}`,
      sector,
    );
  }


  // ==========================
  // ELIMINAR SECTOR
  // ==========================

  remove(
    id: number,
  ) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
    );
  }

  // ==========================
  // ANALITICA DE SECTORES
  // ==========================

  getAnalytics() {
    return this.http.get<SectorAnalytics[]>(
      `${environment.apiUrl}/dashboard/sectors`,
    );
  }
}
