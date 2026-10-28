import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';


import { DashboardActivity, DashboardSummary, DashboardSector,   DashboardHourly,   } from './interfaces/dashboard.models';


import {
  DashboardService,
} from './dashboard.service';



import {
  ActivityChart,
} from './components/activity-chart/activity-chart';

import {
  DwellBySector,
} from './components/dwell-by-sector/dwell-by-sector';

import {
  SummaryCards,
} from './components/summary-cards/summary-cards';

import {
  ActivityBySector,
} from './components/activity-by-sector/activity-by-sector';

import {
  HourlySummary,
} from './components/hourly-summary/hourly-summary';

import {
  ActivityDistribution,
} from './components/activity-distribution/activity-distribution';







@Component({
  selector: 'app-dashboard',
  imports: [
    SummaryCards,
    ActivityChart,
    DwellBySector,
    ActivityBySector,
    HourlySummary,
    ActivityDistribution
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly dashboardService =
    inject(DashboardService);


  // ==========================
  // ESTADO
  // ==========================

  readonly summary =
    signal<DashboardSummary | null>(null);

  readonly isLoading =
    signal(true);

  readonly errorMessage =
    signal<string | null>(null);

  // ==========================
  // ACTIVIDAD
  // ==========================

  readonly activity =
    signal<DashboardActivity[] | null>(
      null,
    );

  // ==========================
  // SECTORES
  // ==========================

  readonly sectors =
    signal<DashboardSector[] | null>(
      null,
    );

  // ==========================
  // ACTIVIDAD HORARIA
  // ==========================

  readonly hourly =
    signal<DashboardHourly | null>(
      null,
    );


  // ==========================
  // INICIALIZACION
  // ==========================

  ngOnInit(): void {
    this.loadSummary();
    this.loadActivity();
    this.loadSectors();
    this.loadHourly();
  }


  // ==========================
  // CARGAR RESUMEN
  // ==========================

  private loadSummary(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardService
      .getSummary()
      .subscribe({
        next: (summary) => {
          this.summary.set(summary);
        },

        error: () => {
          this.errorMessage.set(
            'No fue posible cargar el resumen del dashboard.',
          );

          this.isLoading.set(false);
        },

        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  // ==========================
  // CARGAR ACTIVIDAD
  // ==========================

  private loadActivity(): void {
    this.dashboardService
      .getActivity()
      .subscribe({
        next: (activity) => {
          this.activity.set(
            activity,
          );
        },

        error: () => {
          this.activity.set([]);
        },
      });
  }

  // ==========================
  // CARGAR SECTORES
  // ==========================

  private loadSectors(): void {
    this.dashboardService
      .getSectors()
      .subscribe({
        next: (sectors) => {
          this.sectors.set(
            sectors,
          );
        },

        error: () => {
          this.sectors.set([]);
        },
      });
  }

  // ==========================
  // CARGAR ACTIVIDAD HORARIA
  // ==========================

  private loadHourly(): void {
    this.dashboardService
      .getHourly()
      .subscribe({
        next: (hourly) => {
          this.hourly.set(
            hourly,
          );
        },

        error: (error) => {
          console.error(
            'ERROR /dashboard/hourly:',
            error,
          );

          this.hourly.set({
            hourlyActivity: [],
            peakHour: null,
            valleyHour: null,
          });
        },
      });
  }



}

