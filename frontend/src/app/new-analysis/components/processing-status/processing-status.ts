import {
  Component,
  input,
} from '@angular/core';


// ==========================
// ESTADOS DEL PROCESAMIENTO
// ==========================

export type ProcessingState =
  | 'IDLE'
  | 'READY'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';


@Component({
  selector: 'app-processing-status',
  imports: [],
  templateUrl: './processing-status.html',
  styleUrl: './processing-status.css',
})
export class ProcessingStatus {
  // ==========================
  // ESTADO ACTUAL
  // ==========================

  readonly state =
    input<ProcessingState>('IDLE');


  // ==========================
  // VIDEO CARGADO
  // ==========================

  isVideoLoaded(): boolean {
    return (
      this.state() === 'READY' ||
      this.state() === 'PROCESSING' ||
      this.state() === 'COMPLETED' ||
      this.state() === 'FAILED'
    );
  }


  // ==========================
  // PROCESANDO
  // ==========================

  isProcessing(): boolean {
    return (
      this.state() === 'PROCESSING'
    );
  }


  // ==========================
  // METRICAS GENERADAS
  // ==========================

  areMetricsGenerated(): boolean {
    return (
      this.state() === 'COMPLETED'
    );
  }


  // ==========================
  // RESULTADOS GUARDADOS
  // ==========================

  areResultsSaved(): boolean {
    return (
      this.state() === 'COMPLETED'
    );
  }


  // ==========================
  // ERROR
  // ==========================

  hasFailed(): boolean {
    return (
      this.state() === 'FAILED'
    );
  }
}
