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
  selector: 'app-history-table',
  imports: [
    DatePipe,
  ],
  templateUrl: './history-table.html',
  styleUrl: './history-table.css',
})
export class HistoryTableComponent {
  // ==========================
  // DATOS
  // ==========================

  readonly analyses =
    input.required<HistoryAnalysis[]>();


  // ==========================
  // EVENTOS
  // ==========================

  readonly detailRequested =
    output<HistoryAnalysis>();


  // ==========================
  // VER DETALLE
  // ==========================

  showDetail(
    analysis: HistoryAnalysis,
  ): void {
    this.detailRequested.emit(
      analysis,
    );
  }


  // ==========================
  // TEXTO DEL ESTADO
  // ==========================

  getStatusLabel(
    status: HistoryAnalysis['status'],
  ): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completado';

      case 'PROCESSING':
        return 'Procesando';

      case 'PENDING':
        return 'Pendiente';

      case 'FAILED':
        return 'Error';

      default:
        return status;
    }
  }


  // ==========================
  // CLASE DEL ESTADO
  // ==========================

  getStatusClass(
    status: HistoryAnalysis['status'],
  ): string {
    switch (status) {
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
}
