import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { DashboardHourly } from '../../interfaces/dashboard.models';




// ==========================
// REGISTRO DE CHART.JS
// ==========================

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
);


@Component({
  selector: 'app-hourly-summary',
  imports: [],
  templateUrl: './hourly-summary.html',
  styleUrl: './hourly-summary.css',
})
export class HourlySummary
  implements AfterViewInit, OnChanges, OnDestroy {

  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  @Input({
    required: true,
  })
  hourlyData: DashboardHourly = {
    hourlyActivity: [],
    peakHour: null,
    valleyHour: null,
  };


  // ==========================
  // CANVAS
  // ==========================

  @ViewChild('hourlyCanvas')
  private hourlyCanvas?:
    ElementRef<HTMLCanvasElement>;


  // ==========================
  // GRAFICA
  // ==========================

  private chart:
    Chart<'bar', number[], string> | null =
      null;


  // ==========================
  // CICLO DE VIDA
  // ==========================

  ngAfterViewInit(): void {
    this.renderChart();
  }


  ngOnChanges(
    changes: SimpleChanges,
  ): void {
    if (
      changes['hourlyData'] &&
      !changes['hourlyData'].firstChange
    ) {
      this.renderChart();
    }
  }


  ngOnDestroy(): void {
    this.chart?.destroy();
  }


  // ==========================
  // FORMATEAR HORA
  // ==========================

  formatHour(
    hour: number,
  ): string {
    return `${hour
      .toString()
      .padStart(2, '0')}:00`;
  }


  // ==========================
  // CREAR GRAFICA
  // ==========================

  private renderChart(): void {
    if (
      !this.hourlyCanvas ||
      this.hourlyData.hourlyActivity.length === 0
    ) {
      return;
    }


    // ==========================
    // ELIMINAR GRAFICA ANTERIOR
    // ==========================

    this.chart?.destroy();


    // ==========================
    // ETIQUETAS
    // ==========================

    const labels =
      this.hourlyData.hourlyActivity.map(
        (item) =>
          this.formatHour(item.hour),
      );


    // ==========================
    // DATOS
    // ==========================

    const values =
      this.hourlyData.hourlyActivity.map(
        (item) =>
          item.detectedTrackCount,
      );


    // ==========================
    // CHART.JS
    // ==========================

    this.chart =
      new Chart(
        this.hourlyCanvas.nativeElement,
        {
          type: 'bar',

          data: {
            labels,

            datasets: [
              {
                data: values,

                backgroundColor:
                  '#2563eb',

                borderRadius: 6,

                maxBarThickness: 44,
              },
            ],
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false,
              },

              tooltip: {
                displayColors: false,

                callbacks: {
                  label: (context) =>
                    `${context.raw} tracks`,
                },
              },
            },

            scales: {
              y: {
                beginAtZero: true,

                ticks: {
                  precision: 0,
                },
              },

              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        },
      );
  }
}
