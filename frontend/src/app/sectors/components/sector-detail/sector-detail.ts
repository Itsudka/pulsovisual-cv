import {
  Component,
  input,
  output,
} from '@angular/core';

import {
  Sector,
  SectorAnalytics,
} from '../../interfaces/sectors.models';


@Component({
  selector: 'app-sector-detail',
  imports: [],
  templateUrl: './sector-detail.html',
  styleUrl: './sector-detail.css',
})
export class SectorDetail {
  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly sector =
    input.required<Sector>();

  readonly analytics =
    input<SectorAnalytics | null>(null);

  readonly isDeleting =
    input(false);


  // ==========================
  // EVENTOS
  // ==========================

  readonly close =
    output<void>();

  readonly delete =
    output<number>();


  // ==========================
  // FORMATEAR TIPO
  // ==========================

  formatType(
    type: string,
  ): string {
    const types: Record<string, string> = {
      ENTRADA_SALIDA: 'Entrada / Salida',
      PASILLO: 'Pasillo',
      CAJAS: 'Cajas',
      OTRO: 'Otro',
    };

    return types[type] ?? type;
  }


  // ==========================
  // FORMATEAR ESTADO
  // ==========================

  formatStatus(
    status: string,
  ): string {
    const statuses: Record<string, string> = {
      ACTIVE: 'Activo',
      IN_REVIEW: 'En revisión',
      INACTIVE: 'Inactivo',
    };

    return statuses[status] ?? status;
  }


  // ==========================
  // PUEDE ELIMINAR
  // ==========================

  canDelete(): boolean {
    return (
      this.analytics()?.analysisCount ?? 0
    ) === 0;
  }


  // ==========================
  // ELIMINAR
  // ==========================

  deleteSector(): void {
    if (
      !this.canDelete() ||
      this.isDeleting()
    ) {
      return;
    }

    this.delete.emit(
      this.sector().id,
    );
  }


  // ==========================
  // CERRAR
  // ==========================

  closeModal(): void {
    if (this.isDeleting()) {
      return;
    }

    this.close.emit();
  }
}
