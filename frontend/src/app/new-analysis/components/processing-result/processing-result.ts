import {
  Component,
  computed,
  input,
} from '@angular/core';
import { ProcessedAnalysis } from '../../interfaces/new-analysis.model';




@Component({
  selector: 'app-processing-result',
  imports: [],
  templateUrl: './processing-result.html',
  styleUrl: './processing-result.css',
})
export class ProcessingResult {
  // ==========================
  // RESULTADO
  // ==========================

  readonly result =
    input.required<ProcessedAnalysis>();


  // ==========================
  // METRICA
  // ==========================

  readonly metric =
    computed(() => {
      return this.result().metric;
    });


  // ==========================
  // PERMANENCIA
  // ==========================

  formatDwellTime(): string {
    const metric =
      this.metric();

    if (!metric) {
      return '0.00 s';
    }

    const dwell =
      Number(
        metric.averageDwellSeconds,
      );

    return `${dwell.toFixed(2)} s`;
  }
}
