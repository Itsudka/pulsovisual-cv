import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { Sector } from '../../../sectors/interfaces/sectors.models';
import { AnalysisFormData } from '../../interfaces/new-analysis.model';





@Component({
  selector: 'app-analysis-form',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './analysis-form.html',
  styleUrl: './analysis-form.css',
})
export class AnalysisForm {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly destroyRef =
    inject(DestroyRef);


  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly sectors =
    input.required<Sector[]>();


  // ==========================
  // EVENTOS
  // ==========================

  readonly formDataChange =
    output<AnalysisFormData | null>();


  // ==========================
  // FORMULARIO
  // ==========================

  readonly form =
    this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
        ],
      ],

      sectorId: [
        0,
        [
          Validators.required,
          Validators.min(1),
        ],
      ],

      date: [
        '',
        [
          Validators.required,
        ],
      ],

      time: [
        '',
        [
          Validators.required,
        ],
      ],
    });


  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor() {
    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe(() => {
        this.emitFormData();
      });
  }


  // ==========================
  // EMITIR DATOS
  // ==========================

  private emitFormData(): void {
    if (this.form.invalid) {
      this.formDataChange.emit(
        null,
      );

      return;
    }

    const values =
      this.form.getRawValue();

    this.formDataChange.emit({
      name:
        values.name.trim(),

      sectorId:
        values.sectorId,

      date:
        values.date,

      time:
        values.time,
    });
  }
}
