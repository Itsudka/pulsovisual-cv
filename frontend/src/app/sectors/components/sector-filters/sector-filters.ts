import {
  Component,
  output,
} from '@angular/core';
import { SectorStatus, SectorType } from '../../interfaces/sectors.models';




@Component({
  selector: 'app-sector-filters',
  imports: [],
  templateUrl: './sector-filters.html',
  styleUrl: './sector-filters.css',
})
export class SectorFilters {
  // ==========================
  // EVENTOS
  // ==========================

  readonly statusChange =
    output<SectorStatus | 'ALL'>();

  readonly typeChange =
    output<SectorType | 'ALL'>();


  // ==========================
  // CAMBIAR ESTADO
  // ==========================

  onStatusChange(
    event: Event,
  ): void {
    const select =
      event.target as HTMLSelectElement;

    this.statusChange.emit(
      select.value as SectorStatus | 'ALL',
    );
  }


  // ==========================
  // CAMBIAR TIPO
  // ==========================

  onTypeChange(
    event: Event,
  ): void {
    const select =
      event.target as HTMLSelectElement;

    this.typeChange.emit(
      select.value as SectorType | 'ALL',
    );
  }
}
