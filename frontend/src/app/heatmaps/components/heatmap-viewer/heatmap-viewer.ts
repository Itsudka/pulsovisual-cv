
import {
  Component,
  ElementRef,
  effect,
  input,
  viewChild,
} from '@angular/core';

import {
  AnalysisTrajectories,
} from '../../interfaces/heatmaps.models';

@Component({
  selector: 'app-heatmap-viewer',
  imports: [],
  templateUrl: './heatmap-viewer.html',
  styleUrl: './heatmap-viewer.css',
})
export class HeatmapViewer {

  // ==========================
  // DATOS RECIBIDOS
  // ==========================

  readonly videoUrl = input.required<string>();

  readonly trajectories =
    input.required<AnalysisTrajectories>();

  // ==========================
  // REFERENCIA AL CANVAS
  // ==========================

  private readonly heatCanvas =
    viewChild<ElementRef<HTMLCanvasElement>>(
      'heatCanvas',
    );

  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor() {

    effect(() => {

      const canvas = this.heatCanvas()?.nativeElement;
      const data = this.trajectories();

      if (!canvas) {
        return;
      }

      this.drawHeatmap(canvas, data);

    });

  }

  // ==========================
  // FOTOGRAMA DE REFERENCIA
  // ==========================

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

  // ==========================
  // GENERAR MAPA DE CALOR
  // ==========================

  private drawHeatmap(
    canvas: HTMLCanvasElement,
    data: AnalysisTrajectories,
  ): void {

    const originalWidth = data.video.width;
    const originalHeight = data.video.height;

    if (
      originalWidth <= 0 ||
      originalHeight <= 0
    ) {
      return;
    }

    // Reducimos la resolución interna para
    // procesar las coordenadas más rápido.

    const scale = Math.min(
      1,
      960 / originalWidth,
    );

    const width = Math.max(
      1,
      Math.round(originalWidth * scale),
    );

    const height = Math.max(
      1,
      Math.round(originalHeight * scale),
    );

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, width, height);

    if (data.points.length === 0) {
      return;
    }

    // ==========================
    // CANVAS AUXILIAR
    // ==========================

    const mask = document.createElement('canvas');

    mask.width = width;
    mask.height = height;

    const maskContext = mask.getContext(
      '2d',
      { willReadFrequently: true },
    );

    if (!maskContext) {
      return;
    }

    // ==========================
    // CREAR PUNTO DIFUMINADO
    // ==========================

    const radius = Math.max(
      6,
      Math.round(70 * scale),
    );

    const stamp = document.createElement('canvas');

    stamp.width = radius * 2;
    stamp.height = radius * 2;

    const stampContext = stamp.getContext('2d');

    if (!stampContext) {
      return;
    }

    const gradient =
      stampContext.createRadialGradient(
        radius,
        radius,
        0,
        radius,
        radius,
        radius,
      );

    gradient.addColorStop(
      0,
      'rgba(255,255,255,0.07)',
    );

    gradient.addColorStop(
      1,
      'rgba(255,255,255,0)',
    );

    stampContext.fillStyle = gradient;

    stampContext.fillRect(
      0,
      0,
      stamp.width,
      stamp.height,
    );

    // ==========================
    // ACUMULAR COORDENADAS
    // ==========================

    for (const point of data.points) {

      if (
        !Number.isFinite(point.x) ||
        !Number.isFinite(point.y)
      ) {
        continue;
      }

      if (
        point.x < 0 ||
        point.y < 0 ||
        point.x > originalWidth ||
        point.y > originalHeight
      ) {
        continue;
      }

      const x = point.x * scale;
      const y = point.y * scale;

      maskContext.drawImage(
        stamp,
        x - radius,
        y - radius,
      );

    }

    // ==========================
    // OBTENER INTENSIDADES
    // ==========================

    const imageData =
      maskContext.getImageData(
        0,
        0,
        width,
        height,
      );

    const pixels = imageData.data;

    let maxIntensity = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      maxIntensity = Math.max(
        maxIntensity,
        pixels[i],
      );
    }

    if (maxIntensity === 0) {
      return;
    }

    // ==========================
    // PALETA DE COLORES
    // ==========================

    const palette: [number, number, number][] = [
      [37, 99, 235],   // Azul
      [6, 182, 212],   // Cian
      [34, 197, 94],   // Verde
      [250, 204, 21],  // Amarillo
      [220, 38, 38],   // Rojo
    ];

    // ==========================
    // APLICAR COLORES
    // ==========================

    for (let i = 0; i < pixels.length; i += 4) {

      const intensity =
        pixels[i + 3] / maxIntensity;

      if (intensity < 0.04) {
        pixels[i + 3] = 0;
        continue;
      }

      const position =
        intensity * (palette.length - 1);

      const index = Math.min(
        Math.floor(position),
        palette.length - 2,
      );

      const fraction = position - index;

      for (let channel = 0; channel < 3; channel++) {

        pixels[i + channel] = Math.round(
          palette[index][channel] +
          (
            palette[index + 1][channel] -
            palette[index][channel]
          ) * fraction,
        );

      }

      // Transparencia proporcional a la intensidad.

      pixels[i + 3] = Math.round(
        Math.min(
          0.8,
          Math.pow(intensity, 0.7) * 0.8,
        ) * 255,
      );

    }

    // ==========================
    // DIBUJAR RESULTADO
    // ==========================

    context.putImageData(
      imageData,
      0,
      0,
    );

  }

}
