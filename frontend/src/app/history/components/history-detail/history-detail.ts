import {
  Component,
  input,
  output,
} from '@angular/core';

import {
  DatePipe,
} from '@angular/common';
import { HistoryAnalysis } from '../../interfaces/history.models';




@Component({
  selector: 'app-history-detail',
  imports: [
    DatePipe,
  ],
  templateUrl: './history-detail.html',
  styleUrl: './history-detail.css',
})
export class HistoryDetailComponent {
  // ==========================
  // ANALISIS
  // ==========================

  readonly analysis =
    input.required<HistoryAnalysis>();


  // ==========================
  // EVENTOS
  // ==========================

  readonly closeRequested =
    output<void>();


  // ==========================
  // CERRAR
  // ==========================

  close(): void {
    this.closeRequested.emit();
  }


  // ==========================
  // ESTADO
  // ==========================

  getStatusLabel(): string {
    switch (
      this.analysis().status
    ) {
      case 'COMPLETED':
        return 'Completado';

      case 'PROCESSING':
        return 'Procesando';

      case 'PENDING':
        return 'Pendiente';

      case 'FAILED':
        return 'Error';

      default:
        return this.analysis().status;
    }
  }


  // ==========================
  // CLASE DEL ESTADO
  // ==========================

  getStatusClass(): string {
    switch (
      this.analysis().status
    ) {
      case 'COMPLETED':
        return 'completed';

      case 'PROCESSING':
        return 'processing';

      case 'PENDING':
        return 'pending';

      case 'FAILED':
        return 'failed';

      default:
        return '';
    }
  }


  // ==========================
  // PERMANENCIA
  // ==========================

  getAverageDwell(): string {
    const metric =
      this.analysis().metric;

    if (!metric) {
      return '—';
    }

    const value =
      Number(
        metric.averageDwellSeconds,
      );

    return `${value.toFixed(2)} s`;
  }
}
