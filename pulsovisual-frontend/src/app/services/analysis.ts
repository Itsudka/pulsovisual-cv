import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AnalysisMetrics } from '../interfaces/analysis.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/analysis';

  getAnalysis(): Observable<AnalysisMetrics> {
    return this.http.get<AnalysisMetrics>(this.apiUrl);
  }
}
