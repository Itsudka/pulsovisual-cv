import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';


import {
  SectorsService,
} from '../sectors/sectors.service';



import {
  HistoryService,
} from './history.service';
import { HistoryAnalysis, HistorySummary } from './interfaces/history.models';
import { Sector } from '../sectors/interfaces/sectors.models';
import { HistorySummaryComponent } from './components/history-summary/history-summary';

import {
  HistoryFiltersComponent,
} from './components/history-filters/history-filters';

import {
  HistoryTableComponent,
} from './components/history-table/history-table'


import {
  HistoryFilters,
} from './interfaces/history.models';

import {
  HistoryDetailComponent,
} from './components/history-detail/history-detail';



@Component({
  selector: 'app-history',
  imports: [
    HistorySummaryComponent,
    HistoryFiltersComponent,
    HistoryTableComponent,
    HistoryDetailComponent,

  ],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly historyService =
    inject(HistoryService);

  private readonly sectorsService =
    inject(SectorsService);


  // ==========================
  // DATOS
  // ==========================

  readonly analyses =
    signal<HistoryAnalysis[]>([]);

  readonly sectors =
    signal<Sector[]>([]);


  // ==========================
  // ESTADOS
  // ==========================

  readonly isLoading =
    signal(false);

  readonly errorMessage =
    signal<string | null>(null);


  // ==========================
  // RESUMEN
  // ==========================

  readonly summary =
    computed<HistorySummary>(() => {
      const analyses =
        this.analyses();

      const sectors =
        this.sectors();

      return {
        totalAnalyses:
          analyses.length,

        registeredSectors:
          sectors.length,

        completedAnalyses:
          analyses.filter(
            (analysis) =>
              analysis.status ===
              'COMPLETED',
          ).length,
      };
    });

    // ==========================
    // ANALISIS SELECCIONADO
    // ==========================

    readonly selectedAnalysis =
      signal<HistoryAnalysis | null>(
        null,
      );

  // ==========================
  // DETALLE
  // ==========================


  readonly isDetailLoading =
    signal(false);

  readonly detailError =
    signal<string | null>(
      null,
    );


  // ==========================
  // INICIALIZACION
  // ==========================

  ngOnInit(): void {
    this.loadSectors();

    this.loadHistory();
  }


  // ==========================
  // CARGAR SECTORES
  // ==========================

  private loadSectors(): void {
    this.sectorsService
      .getAll()
      .subscribe({
        next: (sectors) => {
          this.sectors.set(
            sectors,
          );
        },

        error: (error) => {
          console.error(
            'ERROR AL CARGAR SECTORES:',
            error,
          );
        },
      });


  }


  // ==========================
  // CARGAR HISTORIAL
  // ==========================

  private loadHistory(
    filters?: HistoryFilters,
  ): void {
    this.isLoading.set(true);

    this.errorMessage.set(null);

    this.historyService
      .getAll(filters)
      .subscribe({
        next: (analyses) => {
          this.analyses.set(
            analyses,
          );

          this.isLoading.set(false);
        },

        error: (error) => {
          console.error(
            'ERROR AL CARGAR HISTORIAL:',
            error,
          );

          this.errorMessage.set(
            'No fue posible cargar el historial de análisis.',
          );

          this.isLoading.set(false);
        },
      });
  }

  // ==========================
  // APLICAR FILTROS
  // ==========================

  onFiltersApplied(
    filters: HistoryFilters,
  ): void {
    this.loadHistory(
      filters,
    );
  }


  // ==========================
  // LIMPIAR FILTROS
  // ==========================

  onFiltersCleared(): void {
    this.loadHistory();
  }

  // ==========================
  // VER DETALLE
  // ==========================

  onDetailRequested(
    analysis: HistoryAnalysis,
  ): void {
    this.isDetailLoading.set(
      true,
    );

    this.detailError.set(
      null,
    );

    this.historyService
      .getById(
        analysis.id,
      )
      .subscribe({
        next: (detail) => {
          this.selectedAnalysis.set(
            detail,
          );

          this.isDetailLoading.set(
            false,
          );
        },

        error: (error) => {
          console.error(
            'ERROR AL CARGAR DETALLE:',
            error,
          );

          this.detailError.set(
            'No fue posible cargar el detalle del análisis.',
          );

          this.isDetailLoading.set(
            false,
          );
        },
      });
  }


  // ==========================
  // CERRAR DETALLE
  // ==========================

  closeDetail(): void {
    this.selectedAnalysis.set(
      null,
    );

    this.detailError.set(
      null,
    );
  }



}
