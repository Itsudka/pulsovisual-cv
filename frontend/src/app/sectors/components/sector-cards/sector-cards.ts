import {
  Component,
  input,
  output,
} from '@angular/core';

import { Sector, SectorAnalytics } from '../../interfaces/sectors.models';




@Component({
  selector: 'app-sector-cards',
  imports: [],
  templateUrl: './sector-cards.html',
  styleUrl: './sector-cards.css',
})
export class SectorCards {
  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly sectors =
    input.required<Sector[]>();

  readonly analytics =
    input.required<SectorAnalytics[]>();

    // ==========================
    // EVENTOS
    // ==========================

    readonly edit =
      output<Sector>();

    readonly detail =
    output<Sector>();


  // ==========================
  // OBTENER ANALITICA
  // ==========================

  getAnalytics(
    sectorId: number,
  ): SectorAnalytics | null {
    return (
      this.analytics().find(
        (analytics) =>
          analytics.sectorId === sectorId,
      ) ?? null
    );
  }


  // ==========================
  // FORMATEAR TIPO
  // ==========================

  formatType(
    type: string,
  ): string {
    const types: Record<string, string> = {
      ENTRADA_SALIDA:
        'Entrada / Salida',

      PASILLO:
        'Pasillo',

      CAJAS:
        'Cajas',

      OTRO:
        'Otro',
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
      ACTIVE:
        'Activo',

      IN_REVIEW:
        'En revisión',

      INACTIVE:
        'Inactivo',
    };

    return statuses[status] ?? status;
  }

  // ==========================
  // EDITAR
  // ==========================

  editSector(
    sector: Sector,
  ): void {
    this.edit.emit(
      sector,
    );
  }

  // ==========================
  // VER DETALLE
  // ==========================

  viewDetail(
    sector: Sector,
  ): void {
    this.detail.emit(
      sector,
    );
  }
}
