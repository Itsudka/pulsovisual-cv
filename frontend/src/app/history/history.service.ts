import {
  inject,
  Injectable,
} from '@angular/core';

import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  environment,
} from '../../environments/environment';
import { HistoryAnalysis, HistoryFilters } from './interfaces/history.models';



@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly http =
    inject(HttpClient);


  // ==========================
  // URL
  // ==========================

  private readonly apiUrl =
    `${environment.apiUrl}/analyses`;


  // ==========================
  // OBTENER HISTORIAL
  // ==========================

  getAll(
    filters?: HistoryFilters,
  ): Observable<HistoryAnalysis[]> {

    let params =
      new HttpParams();


    // ==========================
    // SECTOR
    // ==========================

    if (filters?.sectorId) {
      params = params.set(
        'sectorId',
        filters.sectorId.toString(),
      );
    }


    // ==========================
    // ESTADO
    // ==========================

    if (filters?.status) {
      params = params.set(
        'status',
        filters.status,
      );
    }


    // ==========================
    // FECHA DESDE
    // ==========================

    if (filters?.dateFrom) {
      params = params.set(
        'dateFrom',
        filters.dateFrom,
      );
    }


    // ==========================
    // FECHA HASTA
    // ==========================

    if (filters?.dateTo) {
      params = params.set(
        'dateTo',
        filters.dateTo,
      );
    }


    // ==========================
    // REQUEST
    // ==========================

    return this.http.get<
      HistoryAnalysis[]
    >(
      this.apiUrl,
      {
        params,
      },
    );
  }

  // ==========================
  // OBTENER ANALISIS POR ID
  // ==========================

  getById(
    id: number,
  ): Observable<HistoryAnalysis> {
    return this.http.get<HistoryAnalysis>(
      `${this.apiUrl}/${id}`,
    );
  }
}
