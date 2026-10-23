import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';


import { AnalysisMetrics } from './interfaces/analysis.interface';
import { AnalysisService } from './services/analysis';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly analysisService = inject(AnalysisService);


  // ==========================
  // ESTADO
  // ==========================

  analysis = signal<AnalysisMetrics | null>(null);

  loading = signal(true);

  error = signal<string | null>(null);


  // ==========================
  // PERMANENCIA POR ID
  // ==========================

  dwellRows = computed(() => {
    const data = this.analysis();

    if (!data) {
      return [];
    }

    const entries = Object.entries(
      data.permanencia.tiempos_segundos
    );

    const maxSeconds = Math.max(
      ...entries.map(([, seconds]) => seconds),
      1
    );

    return entries.map(([id, seconds]) => ({
      id,
      seconds,
      percentage: (seconds / maxSeconds) * 100
    }));
  });


  // ==========================
  // FLUJO
  // ==========================

  flowRows = computed(() => {
    const data = this.analysis();

    if (!data) {
      return [];
    }

    const arriba = data.flujo.arriba;
    const abajo = data.flujo.abajo;

    const maxFlow = Math.max(arriba, abajo, 1);

    return [
      {
        label: 'Arriba',
        value: arriba,
        percentage: (arriba / maxFlow) * 100
      },
      {
        label: 'Abajo',
        value: abajo,
        percentage: (abajo / maxFlow) * 100
      }
    ];
  });


  // ==========================
  // CARGA DEL ANÁLISIS
  // ==========================

  ngOnInit(): void {
    this.analysisService.getAnalysis().subscribe({
      next: (data) => {
        this.analysis.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(error);

        this.error.set(
          'No fue posible obtener las métricas del análisis.'
        );

        this.loading.set(false);
      }
    });
  }
}
