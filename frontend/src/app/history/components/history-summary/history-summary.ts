import {
  Component,
  input,
} from '@angular/core';
import { HistorySummary } from '../../interfaces/history.models';




@Component({
  selector: 'app-history-summary',
  imports: [],
  templateUrl: './history-summary.html',
  styleUrl: './history-summary.css',
})
export class HistorySummaryComponent {
  // ==========================
  // RESUMEN
  // ==========================

  readonly summary =
    input.required<HistorySummary>();
}
