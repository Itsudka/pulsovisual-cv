import {
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';


@Component({
  selector: 'app-processing-config',
  imports: [],
  templateUrl: './processing-config.html',
  styleUrl: './processing-config.css',
})
export class ProcessingConfig {
  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly videoUrl =
    input<string | null>(null);

  readonly flowLinePosition =
    input(220);

  readonly flowTolerancePx =
    input(10);

  readonly isReady =
    input(false);

  readonly isProcessing =
    input(false);


  // ==========================
  // EVENTOS
  // ==========================

  readonly positionChange =
    output<number>();

  readonly toleranceChange =
    output<number>();

  readonly processRequested =
    output<void>();


  // ==========================
  // VIDEO
  // ==========================

  readonly videoHeight =
    signal(0);

  readonly loadedVideoUrl =
    signal<string | null>(null);

  readonly failedVideoUrl =
    signal<string | null>(null);


  // ==========================
  // ESTADOS CALCULADOS
  // ==========================

  readonly effectiveVideoHeight =
    computed(() => {
      if (
        this.loadedVideoUrl() !==
        this.videoUrl()
      ) {
        return 0;
      }

      return this.videoHeight();
    });

  readonly previewFailed =
    computed(() => {
      return (
        this.videoUrl() !== null &&
        this.failedVideoUrl() ===
          this.videoUrl()
      );
    });

  readonly sliderMax =
    computed(() => {
      const height =
        this.effectiveVideoHeight();

      if (height <= 0) {
        return 500;
      }

      return Math.max(
        height - 1,
        1,
      );
    });

  readonly flowLineTopPercent =
    computed(() => {
      const height =
        this.effectiveVideoHeight();

      if (height <= 0) {
        return 50;
      }

      const position =
        Math.min(
          Math.max(
            this.flowLinePosition(),
            0,
          ),
          height - 1,
        );

      return (
        position /
        height
      ) * 100;
    });


  // ==========================
  // METADATOS DEL VIDEO
  // ==========================

  onVideoLoaded(
    event: Event,
  ): void {
    const video =
      event.target as HTMLVideoElement;

    const height =
      video.videoHeight;

    this.videoHeight.set(
      height,
    );

    this.loadedVideoUrl.set(
      this.videoUrl(),
    );

    this.failedVideoUrl.set(
      null,
    );


    // ==========================
    // LIMITAR POSICION
    // ==========================

    const maximumPosition =
      Math.max(
        height - 1,
        0,
      );

    if (
      this.flowLinePosition() >
      maximumPosition
    ) {
      this.positionChange.emit(
        maximumPosition,
      );
    }
  }


  // ==========================
  // ERROR DE PREVIEW
  // ==========================

  onVideoError(): void {
    this.failedVideoUrl.set(
      this.videoUrl(),
    );
  }


  // ==========================
  // CAMBIAR POSICION
  // ==========================

  onPositionChange(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    this.positionChange.emit(
      Number(input.value),
    );
  }


  // ==========================
  // CAMBIAR TOLERANCIA
  // ==========================

  onToleranceChange(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    this.toleranceChange.emit(
      Number(input.value),
    );
  }


  // ==========================
  // INICIAR ANALISIS
  // ==========================

  startProcessing(): void {
    if (
      !this.isReady() ||
      this.isProcessing()
    ) {
      return;
    }

    this.processRequested.emit();
  }
}
