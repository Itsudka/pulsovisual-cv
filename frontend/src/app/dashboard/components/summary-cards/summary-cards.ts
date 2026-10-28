import {
  Component,
  input,
} from '@angular/core';
import { DashboardSummary } from '../../interfaces/dashboard.models';




@Component({
  selector: 'app-summary-cards',
  imports: [],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards {
  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly summary =
    input.required<DashboardSummary>();
}
