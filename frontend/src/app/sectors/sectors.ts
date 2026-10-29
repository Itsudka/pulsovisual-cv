import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  SectorList,
} from './components/sector-list/sector-list';


import {
  SectorFilters,
} from './components/sector-filters/sector-filters';

import {
  SectorSummaryComponent,
} from './components/sector-summary/sector-summary';

import {
  SectorCards,
} from './components/sector-cards/sector-cards';

import {
  SectorsService,
} from './sectors.service';

import {
  SectorForm,
} from './components/sector-form/sector-form';

import {
  SectorDetail,
} from './components/sector-detail/sector-detail';

import {
  CreateSectorRequest,
  Sector,
  SectorAnalytics,
  SectorStatus,
  SectorSummary,
  SectorType,
  UpdateSectorRequest,
} from './interfaces/sectors.models';




@Component({
  selector: 'app-sectors',
  imports: [
    SectorList,
    SectorSummaryComponent,
    SectorFilters,
    SectorCards,
    SectorForm,
    SectorDetail
],
  templateUrl: './sectors.html',
  styleUrl: './sectors.css',
})
export class Sectors implements OnInit {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly sectorsService =
    inject(SectorsService);


  // ==========================
  // ESTADO
  // ==========================

  readonly sectors =
    signal<Sector[]>([]);

  readonly isLoading =
    signal(true);

  readonly errorMessage =
    signal<string | null>(null);

  // ==========================
  // DETALLE
  // ==========================

  readonly detailSector =
    signal<Sector | null>(
      null,
    );

  readonly isDeleting =
    signal(false);


    // ==========================
    // ANALITICA
    // ==========================

    readonly analytics =
      signal<SectorAnalytics[]>([]);


    // ==========================
    // FILTROS
    // ==========================

    readonly selectedStatus =
      signal<SectorStatus | 'ALL'>(
        'ALL',
      );

    readonly selectedType =
      signal<SectorType | 'ALL'>(
        'ALL',
      );


    // ==========================
    // MODAL
    // ==========================

    readonly isFormOpen =
      signal(false);

    readonly selectedSector =
      signal<Sector | null>(
        null,
      );

    readonly isSaving =
      signal(false);


  // ==========================
  // INICIALIZACION
  // ==========================

  ngOnInit(): void {
    this.loadSectors();
    this.loadAnalytics();
  }


  // ==========================
  // CARGAR SECTORES
  // ==========================

  private loadSectors(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.sectorsService
      .getAll()
      .subscribe({
        next: (sectors) => {
          this.sectors.set(
            sectors,
          );
        },

        error: () => {
          this.errorMessage.set(
            'No fue posible cargar los sectores.',
          );

          this.isLoading.set(false);
        },

        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  // ==========================
  // RESUMEN
  // ==========================

  readonly summary =
    computed<SectorSummary>(() => {
      const sectors =
        this.sectors();

      const analytics =
        this.analytics();

      const associatedAnalyses =
        analytics.reduce(
          (total, sector) =>
            total + sector.analysisCount,
          0,
        );

      const totalDwell =
        analytics.reduce(
          (total, sector) =>
            total + sector.averageDwellSeconds,
          0,
        );

      const averageDwellSeconds =
        analytics.length > 0
          ? Number(
              (
                totalDwell /
                analytics.length
              ).toFixed(2),
            )
          : 0;

      return {
        registeredSectors:
          sectors.length,

        associatedAnalyses,

        activeSectors:
          sectors.filter(
            (sector) =>
              sector.status === 'ACTIVE',
          ).length,

        averageDwellSeconds,
      };
    });

    // ==========================
    // SECTORES FILTRADOS
    // ==========================

    readonly filteredSectors =
      computed(() => {
        return this.sectors().filter(
          (sector) => {
            const matchesStatus =
              this.selectedStatus() === 'ALL' ||
              sector.status ===
                this.selectedStatus();

            const matchesType =
              this.selectedType() === 'ALL' ||
              sector.type ===
                this.selectedType();

            return (
              matchesStatus &&
              matchesType
            );
          },
        );
      });

      // ==========================
      // ANALITICA DEL DETALLE
      // ==========================

      readonly detailAnalytics =
        computed(() => {
          const sector =
            this.detailSector();

          if (!sector) {
            return null;
          }

          return (
            this.analytics().find(
              (analytics) =>
                analytics.sectorId === sector.id,
            ) ?? null
          );
        });


    // ==========================
    // CARGAR ANALITICA
    // ==========================

    private loadAnalytics(): void {
      this.sectorsService
        .getAnalytics()
        .subscribe({
          next: (analytics) => {
            this.analytics.set(
              analytics,
            );
          },

          error: () => {
            this.analytics.set([]);
          },
        });
    }


    // ==========================
    // FILTRAR POR ESTADO
    // ==========================

    onStatusChange(
      status: SectorStatus | 'ALL',
    ): void {
      this.selectedStatus.set(
        status,
      );
    }


    // ==========================
    // FILTRAR POR TIPO
    // ==========================

    onTypeChange(
      type: SectorType | 'ALL',
    ): void {
      this.selectedType.set(
        type,
      );
    }

    // ==========================
    // ABRIR CREACION
    // ==========================

    openCreateForm(): void {
      this.selectedSector.set(null);

      this.isFormOpen.set(true);
    }


    // ==========================
    // ABRIR EDICION
    // ==========================

    openEditForm(
      sector: Sector,
    ): void {
      this.selectedSector.set(
        sector,
      );

      this.isFormOpen.set(true);
    }


    // ==========================
    // CERRAR FORMULARIO
    // ==========================

    closeForm(): void {
      if (this.isSaving()) {
        return;
      }

      this.isFormOpen.set(false);

      this.selectedSector.set(null);
    }


    // ==========================
    // CREAR SECTOR
    // ==========================

    createSector(
      data: CreateSectorRequest,
    ): void {
      this.isSaving.set(true);

      this.sectorsService
        .create(data)
        .subscribe({
          next: () => {
            this.closeFormAfterSave();

            this.loadSectors();
            this.loadAnalytics();
          },

          error: () => {
            this.isSaving.set(false);
          },
        });
    }


    // ==========================
    // EDITAR SECTOR
    // ==========================

    updateSector(
      event: {
        id: number;
        data: UpdateSectorRequest;
      },
    ): void {
      this.isSaving.set(true);

      this.sectorsService
        .update(
          event.id,
          event.data,
        )
        .subscribe({
          next: () => {
            this.closeFormAfterSave();

            this.loadSectors();
            this.loadAnalytics();
          },

          error: () => {
            this.isSaving.set(false);
          },
        });
    }


    // ==========================
    // CERRAR DESPUES DE GUARDAR
    // ==========================

    private closeFormAfterSave(): void {
      this.isSaving.set(false);

      this.isFormOpen.set(false);

      this.selectedSector.set(null);
    }

    // ==========================
    // ABRIR DETALLE
    // ==========================

    openDetail(
      sector: Sector,
    ): void {
      this.detailSector.set(
        sector,
      );
    }


    // ==========================
    // CERRAR DETALLE
    // ==========================

    closeDetail(): void {
      if (this.isDeleting()) {
        return;
      }

      this.detailSector.set(null);
    }


    // ==========================
    // ELIMINAR SECTOR
    // ==========================

    deleteSector(
      id: number,
    ): void {
      this.isDeleting.set(true);

      this.sectorsService
        .remove(id)
        .subscribe({
          next: () => {
            this.isDeleting.set(false);

            this.detailSector.set(null);

            this.loadSectors();
            this.loadAnalytics();
          },

          error: () => {
            this.isDeleting.set(false);
          },
        });
    }

}
