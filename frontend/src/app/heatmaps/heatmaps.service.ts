
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AnalysisTrajectories } from './interfaces/heatmaps.models';

@Injectable({
  providedIn: 'root',
})
export class HeatmapsService {

  private readonly http = inject(HttpClient);

  getTrajectories(
    analysisId: number,
  ): Observable<AnalysisTrajectories> {

    return this.http.get<AnalysisTrajectories>(
      `${environment.apiUrl}/analyses/${analysisId}/trajectories`,
    );
  }
}
