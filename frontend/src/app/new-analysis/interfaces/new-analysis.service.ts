import {
  HttpClient,
} from '@angular/common/http';

import {
  inject,
  Injectable,
} from '@angular/core';
import { ProcessAnalysisRequest, ProcessedAnalysis } from './new-analysis.model';
import { environment } from '../../../environments/environment';






@Injectable({
  providedIn: 'root',
})
export class NewAnalysisService {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly http =
    inject(HttpClient);


  // ==========================
  // CONFIGURACION
  // ==========================

  private readonly apiUrl =
    `${environment.apiUrl}/analyses`;


  // ==========================
  // PROCESAR ANALISIS
  // ==========================

  processAnalysis(
    request: ProcessAnalysisRequest,
  ) {
    // ==========================
    // FORM DATA
    // ==========================

    const formData =
      new FormData();


    // ==========================
    // VIDEO
    // ==========================

    formData.append(
      'video',
      request.video,
    );


    // ==========================
    // DATOS DEL ANALISIS
    // ==========================

    formData.append(
      'sectorId',
      String(request.sectorId),
    );

    formData.append(
      'name',
      request.name,
    );

    formData.append(
      'recordedAt',
      request.recordedAt,
    );

    formData.append(
      'flowLineOrientation',
      request.flowLineOrientation,
    );

    formData.append(
      'flowLinePosition',
      String(
        request.flowLinePosition,
      ),
    );

    formData.append(
      'flowTolerancePx',
      String(
        request.flowTolerancePx,
      ),
    );


    // ==========================
    // PETICION
    // ==========================

    return this.http.post<ProcessedAnalysis>(
      `${this.apiUrl}/process`,
      formData,
    );
  }
}
