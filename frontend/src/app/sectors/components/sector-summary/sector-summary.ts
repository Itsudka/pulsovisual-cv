import {
  Component,
  input,
} from '@angular/core';
import { SectorSummary } from '../../interfaces/sectors.models';




@Component({
  selector: 'app-sector-summary',
  imports: [],
  templateUrl: './sector-summary.html',
  styleUrl: './sector-summary.css',
})
export class SectorSummaryComponent {
  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly summary =
    input.required<SectorSummary>();
}
