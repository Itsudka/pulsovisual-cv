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
import { DashboardSector } from '../../interfaces/dashboard.models';




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
  selector: 'app-dwell-by-sector',
  imports: [],
  templateUrl: './dwell-by-sector.html',
  styleUrl: './dwell-by-sector.css',
})
export class DwellBySector
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

  @ViewChild('dwellCanvas')
  private dwellCanvas?:
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
      !this.dwellCanvas ||
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
          sector.averageDwellSeconds,
      );


    // ==========================
    // CHART.JS
    // ==========================

    this.chart =
      new Chart(
        this.dwellCanvas.nativeElement,
        {
          type: 'bar',

          data: {
            labels,

            datasets: [
              {
                data: values,

                backgroundColor:
                  '#38bdf8',

                borderRadius: 6,

                barThickness: 18,
              },
            ],
          },

          options: {
            indexAxis: 'y',

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
                    `${context.raw} s`,
                },
              },
            },

            scales: {
              x: {
                beginAtZero: true,

                title: {
                  display: true,
                  text: 'Segundos',
                },
              },

              y: {
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
