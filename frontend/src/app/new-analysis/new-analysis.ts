import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';


import {
  SectorsService,
} from '../sectors/sectors.service';

import {
  AnalysisForm,
} from './components/analysis-form/analysis-form';

import {
  ProcessingConfig,
} from './components/processing-config/processing-config';

import {
  ProcessingState,
  ProcessingStatus,
} from './components/processing-status/processing-status';

import {
  ProcessingResult,
} from './components/processing-result/processing-result';

import {
  VideoUpload,
} from './components/video-upload/video-upload';
import { NewAnalysisService } from './interfaces/new-analysis.service';
import { AnalysisFormData, ProcessedAnalysis } from './interfaces/new-analysis.model';
import { Sector } from '../sectors/interfaces/sectors.models';



@Component({
  selector: 'app-new-analysis',
  imports: [
    VideoUpload,
    AnalysisForm,
    ProcessingConfig,
    ProcessingStatus,
    ProcessingResult,
  ],
  templateUrl: './new-analysis.html',
  styleUrl: './new-analysis.css',
})
export class NewAnalysis
  implements OnInit, OnDestroy {

  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly sectorsService =
    inject(SectorsService);

  private readonly newAnalysisService =
    inject(NewAnalysisService);


  // ==========================
  // VIDEO
  // ==========================

  readonly selectedVideo =
    signal<File | null>(null);

  readonly videoUrl =
    signal<string | null>(null);


  // ==========================
  // SECTORES
  // ==========================

  readonly sectors =
    signal<Sector[]>([]);


  // ==========================
  // FORMULARIO
  // ==========================

  readonly analysisFormData =
    signal<AnalysisFormData | null>(
      null,
    );


  // ==========================
  // CONFIGURACION
  // ==========================

  readonly flowLinePosition =
    signal(220);

  readonly flowTolerancePx =
    signal(10);


  // ==========================
  // PROCESAMIENTO
  // ==========================

  readonly processingState =
    signal<ProcessingState>('IDLE');

  readonly result =
    signal<ProcessedAnalysis | null>(
      null,
    );

  readonly errorMessage =
    signal<string | null>(
      null,
    );


  // ==========================
  // ESTADOS CALCULADOS
  // ==========================

  readonly isProcessing =
    computed(
      () =>
        this.processingState() ===
        'PROCESSING',
    );

  readonly isReady =
    computed(() => {
      return (
        this.selectedVideo() !== null &&
        this.analysisFormData() !== null &&
        !this.isProcessing()
      );
    });


  // ==========================
  // INICIALIZACION
  // ==========================

  ngOnInit(): void {
    this.loadSectors();
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
            sectors.filter(
              (sector) =>
                sector.status === 'ACTIVE',
            ),
          );
        },

        error: () => {
          this.sectors.set([]);
        },
      });
  }


  // ==========================
  // SELECCIONAR VIDEO
  // ==========================

  onVideoSelected(
    file: File,
  ): void {
    const currentUrl =
      this.videoUrl();

    if (currentUrl) {
      URL.revokeObjectURL(
        currentUrl,
      );
    }


    // ==========================
    // GUARDAR VIDEO
    // ==========================

    this.selectedVideo.set(
      file,
    );


    // ==========================
    // CREAR PREVIEW
    // ==========================

    this.videoUrl.set(
      URL.createObjectURL(
        file,
      ),
    );


    // ==========================
    // REINICIAR RESULTADO
    // ==========================

    this.result.set(null);

    this.errorMessage.set(null);

    this.processingState.set(
      'READY',
    );
  }


  // ==========================
  // FORMULARIO
  // ==========================

  onFormDataChange(
    data: AnalysisFormData | null,
  ): void {
    this.analysisFormData.set(
      data,
    );
  }


  // ==========================
  // CAMBIAR POSICION
  // ==========================

  onPositionChange(
    position: number,
  ): void {
    this.flowLinePosition.set(
      position,
    );
  }


  // ==========================
  // CAMBIAR TOLERANCIA
  // ==========================

  onToleranceChange(
    tolerance: number,
  ): void {
    this.flowTolerancePx.set(
      tolerance,
    );
  }


  // ==========================
  // INICIAR ANALISIS
  // ==========================

  startAnalysis(): void {
    const video =
      this.selectedVideo();

    const formData =
      this.analysisFormData();

    if (
      !video ||
      !formData ||
      this.isProcessing()
    ) {
      return;
    }


    // ==========================
    // FECHA DE GRABACION
    // ==========================

    const recordedAt =
      `${formData.date}T${formData.time}:00`;


    // ==========================
    // ESTADO
    // ==========================

    this.processingState.set(
      'PROCESSING',
    );

    this.errorMessage.set(null);
    this.result.set(null);


    // ==========================
    // PROCESAR
    // ==========================

    this.newAnalysisService
      .processAnalysis({
        video,

        sectorId:
          formData.sectorId,

        name:
          formData.name,

        recordedAt,

        flowLineOrientation:
          'HORIZONTAL',

        flowLinePosition:
          this.flowLinePosition(),

        flowTolerancePx:
          this.flowTolerancePx(),
      })
      .subscribe({
        next: (result) => {
          this.result.set(
            result,
          );

          this.processingState.set(
            'COMPLETED',
          );
        },

        error: (error) => {
          console.error(
            'ERROR AL PROCESAR ANALISIS:',
            error,
          );

          this.processingState.set(
            'FAILED',
          );

          this.errorMessage.set(
            'No fue posible procesar el video. Intenta nuevamente.',
          );
        },
      });
  }


  // ==========================
  // DESTRUIR COMPONENTE
  // ==========================

  ngOnDestroy(): void {
    const currentUrl =
      this.videoUrl();

    if (currentUrl) {
      URL.revokeObjectURL(
        currentUrl,
      );
    }
  }
}
