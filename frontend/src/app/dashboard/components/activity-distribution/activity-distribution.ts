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
  ArcElement,
  Chart,
  DoughnutController,
  Legend,
  Tooltip,
} from 'chart.js';
import { DashboardSector } from '../../interfaces/dashboard.models';




// ==========================
// REGISTRO DE CHART.JS
// ==========================

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
);


@Component({
  selector: 'app-activity-distribution',
  imports: [],
  templateUrl: './activity-distribution.html',
  styleUrl: './activity-distribution.css',
})
export class ActivityDistribution
  implements AfterViewInit, OnChanges, OnDestroy {

  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  @Input({
    required: true,
  })
  sectors: DashboardSector[] = [];


  // ==========================
  // CANVAS
  // ==========================

  @ViewChild('distributionCanvas')
  private distributionCanvas?:
    ElementRef<HTMLCanvasElement>;


  // ==========================
  // GRAFICA
  // ==========================

  private chart:
    Chart<'doughnut', number[], string> | null =
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
      changes['sectors'] &&
      !changes['sectors'].firstChange
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
      !this.distributionCanvas ||
      this.sectors.length === 0
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
      this.sectors.map(
        (sector) =>
          sector.sectorName,
      );


    // ==========================
    // DATOS
    // ==========================

    const values =
      this.sectors.map(
        (sector) =>
          sector.detectedTrackCount,
      );


    // ==========================
    // TOTAL
    // ==========================

    const total =
      values.reduce(
        (sum, value) =>
          sum + value,
        0,
      );


    // ==========================
    // COLORES
    // ==========================

    const colors = [
      '#2563eb',
      '#38bdf8',
      '#67e8f9',
      '#bfdbfe',
      '#64748b',
    ];


    // ==========================
    // CHART.JS
    // ==========================

    this.chart =
      new Chart(
        this.distributionCanvas.nativeElement,
        {
          type: 'doughnut',

          data: {
            labels,

            datasets: [
              {
                data: values,

                backgroundColor:
                  values.map(
                    (_, index) =>
                      colors[
                        index % colors.length
                      ],
                  ),

                borderWidth: 0,

                hoverOffset: 6,
              },
            ],
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            cutout: '62%',

            plugins: {
              legend: {
                position: 'right',

                labels: {
                  boxWidth: 12,
                  boxHeight: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                },
              },

              tooltip: {
                displayColors: false,

                callbacks: {
                  label: (context) => {
                    const value =
                      Number(context.raw);

                    const percentage =
                      total > 0
                        ? (
                            (value / total) *
                            100
                          ).toFixed(1)
                        : '0';

                    return `${value} tracks (${percentage}%)`;
                  },
                },
              },
            },
          },
        },
      );
  }
}
