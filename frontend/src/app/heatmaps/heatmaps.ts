
import {
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HistoryService } from '../history/history.service';
import { HistoryAnalysis } from '../history/interfaces/history.models';

import { HeatmapsService } from './heatmaps.service';
import { AnalysisTrajectories } from './interfaces/heatmaps.models';


import { HeatmapViewer } from './components/heatmap-viewer/heatmap-viewer';


@Component({
  selector: 'app-heatmaps',
  imports: [HeatmapViewer],
  templateUrl: './heatmaps.html',
  styleUrl: './heatmaps.css',
})
export class Heatmaps {

  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly historyService = inject(HistoryService);
  private readonly destroyRef = inject(DestroyRef);

  // ==========================
  // ESTADO
  // ==========================

  readonly analyses = signal<HistoryAnalysis[]>([]);
  readonly selectedAnalysisId = signal<number | null>(null);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // ==========================
  // ANALISIS SELECCIONADO
  // ==========================

  readonly selectedAnalysis = computed(() => {
    const id = this.selectedAnalysisId();

    return this.analyses().find(
      (analysis) => analysis.id === id,
    ) ?? null;
  });

  readonly videoUrl = signal<string | null>(null);
  readonly videoError = signal<string | null>(null);

  // ==========================
  // SERVICIO DE TRAYECTORIAS
  // ==========================

  private readonly heatmapsService = inject(HeatmapsService);

  // ==========================
  // ESTADO DE TRAYECTORIAS
  // ==========================

  readonly trajectories = signal<AnalysisTrajectories | null>(null);
  readonly isLoadingTrajectories = signal(false);
  readonly trajectoriesError = signal<string | null>(null);


  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor() {
    this.loadAnalyses();
  }

  // ==========================
  // CARGAR ANALISIS COMPLETADOS
  // ==========================

  loadAnalyses(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.historyService
      .getAll({ status: 'COMPLETED' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (analyses) => {
          this.analyses.set(analyses);
          this.selectedAnalysisId.set(null);
          this.isLoading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);

          this.errorMessage.set(
            error.status === 401
              ? 'Tu sesión ha expirado. Inicia sesión nuevamente.'
              : 'No fue posible cargar los análisis.',
          );
        },
      });
  }


  onAnalysisChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    const id = select.value
      ? Number(select.value)
      : null;

    this.selectedAnalysisId.set(id);

    // Limpiamos el resultado anterior.
    this.trajectories.set(null);
    this.trajectoriesError.set(null);
    this.isLoadingTrajectories.set(false);

    if (id === null) {
      return;
    }

    this.isLoadingTrajectories.set(true);

    this.videoUrl.set(null);
    this.videoError.set(null);

    this.heatmapsService
      .getTrajectories(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          // Evitamos mostrar una respuesta de una selección anterior.
          if (this.selectedAnalysisId() !== id) return;

          this.trajectories.set(data);
          this.isLoadingTrajectories.set(false);
        },

        error: (error: HttpErrorResponse) => {
          if (this.selectedAnalysisId() !== id) return;

          this.isLoadingTrajectories.set(false);

          this.trajectoriesError.set(
            error.status === 404
              ? 'Este análisis no tiene trayectorias disponibles.'
              : error.status === 401
                ? 'Tu sesión ha expirado.'
                : 'No fue posible recuperar las trayectorias.',
          );
        },
      });


    // ==========================
    // OBTENER VIDEO DEL ANALISIS
    // ==========================

    this.historyService
      .getVideoUrl(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (this.selectedAnalysisId() !== id) return;

          this.videoUrl.set(response.url);
        },

        error: () => {
          if (this.selectedAnalysisId() !== id) return;

          this.videoError.set(
            'No fue posible recuperar el video del análisis.',
          );
        },
      });



  }


  seekReferenceFrame(event: Event): void {
    const video = event.target as HTMLVideoElement;

    if (
      Number.isFinite(video.duration) &&
      video.duration > 0
    ) {
      video.currentTime = Math.min(
        1,
        video.duration / 2,
      );
    }
  }

}
