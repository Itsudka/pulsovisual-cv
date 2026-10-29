
import {
  Component,
  input,
  output,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AnalysisStatus, HistoryFilters } from '../../interfaces/history.models';
import { Sector } from '../../../sectors/interfaces/sectors.models';




@Component({
  selector: 'app-history-filters',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './history-filters.html',
  styleUrl: './history-filters.css',
})
export class HistoryFiltersComponent {
  // ==========================
  // DATOS
  // ==========================

  readonly sectors =
    input.required<Sector[]>();


  // ==========================
  // EVENTOS
  // ==========================

  readonly filtersApplied =
    output<HistoryFilters>();

  readonly filtersCleared =
    output<void>();


  // ==========================
  // FORMULARIO
  // ==========================

  readonly form =
    new FormBuilder().nonNullable.group({
      sectorId: 0,
      dateFrom: '',
      dateTo: '',
      status: '',
    });


  // ==========================
  // APLICAR
  // ==========================

  applyFilters(): void {
    const values =
      this.form.getRawValue();

    const filters:
      HistoryFilters = {};

    if (
      values.sectorId > 0
    ) {
      filters.sectorId =
        values.sectorId;
    }

    if (
      values.dateFrom
    ) {
      filters.dateFrom =
        values.dateFrom;
    }

    if (
      values.dateTo
    ) {
      filters.dateTo =
        values.dateTo;
    }

    if (
      values.status
    ) {
      filters.status =
        values.status as AnalysisStatus;
    }

    this.filtersApplied.emit(
      filters,
    );
  }


  // ==========================
  // LIMPIAR
  // ==========================

  clearFilters(): void {
    this.form.reset({
      sectorId: 0,
      dateFrom: '',
      dateTo: '',
      status: '',
    });

    this.filtersCleared.emit();
  }
}
