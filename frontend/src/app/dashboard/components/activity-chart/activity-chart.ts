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
  CategoryScale,
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DashboardActivity } from '../../interfaces/dashboard.models';




// ==========================
// REGISTRO DE CHART.JS
// ==========================

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);


@Component({
  selector: 'app-activity-chart',
  imports: [],
  templateUrl: './activity-chart.html',
  styleUrl: './activity-chart.css',
})
export class ActivityChart
  implements AfterViewInit, OnChanges, OnDestroy {

  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  @Input({
    required: true,
  })
  activity: DashboardActivity[] = [];


  // ==========================
  // CANVAS
  // ==========================

  @ViewChild('activityCanvas')
  private activityCanvas?:
    ElementRef<HTMLCanvasElement>;


  // ==========================
  // GRAFICA
  // ==========================

  private chart:
    Chart<'line', number[], string> | null =
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
      changes['activity'] &&
      !changes['activity'].firstChange
    ) {
      this.renderChart();
    }
  }


  ngOnDestroy(): void {
    this.chart?.destroy();
  }


  // ==========================
  // CREAR GRAFICA
  // ==========================

  private renderChart(): void {
    if (
      !this.activityCanvas ||
      this.activity.length === 0
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
      this.activity.map(
        (item) =>
          this.formatDate(item.date),
      );


    // ==========================
    // DATOS
    // ==========================

    const values =
      this.activity.map(
        (item) =>
          item.detectedTrackCount,
      );


    // ==========================
    // CHART.JS
    // ==========================

    this.chart =
      new Chart(
        this.activityCanvas.nativeElement,
        {
          type: 'line',

          data: {
            labels,

            datasets: [
              {
                label:
                  'Tracks detectados',

                data: values,

                borderColor:
                  '#2563eb',

                backgroundColor:
                  '#2563eb',

                borderWidth: 3,

                pointRadius: 5,

                pointHoverRadius: 7,

                tension: 0.35,
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


  // ==========================
  // FORMATEAR FECHA
  // ==========================

  private formatDate(
    date: string,
  ): string {
    const [
      year,
      month,
      day,
    ] = date.split('-');

    if (
      !year ||
      !month ||
      !day
    ) {
      return date;
    }

    return `${day}/${month}`;
  }
}
