import {
  Component,
  input,
  output,
} from '@angular/core';

import { Sector } from '../../interfaces/sectors.models';




@Component({
  selector: 'app-sector-list',
  imports: [],
  templateUrl: './sector-list.html',
  styleUrl: './sector-list.css',
})
export class SectorList {
  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly sectors =
    input.required<Sector[]>();

  readonly detail =
    output<Sector>();

  viewDetail(
    sector: Sector,
  ): void {
    this.detail.emit(
      sector,
    );
}
}
