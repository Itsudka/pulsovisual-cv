import {
  Component,
  effect,
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
  CreateSectorRequest,
  Sector,
  SectorStatus,
  SectorType,
  UpdateSectorRequest,
} from '../../interfaces/sectors.models';


@Component({
  selector: 'app-sector-form',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './sector-form.html',
  styleUrl: './sector-form.css',
})
export class SectorForm {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly formBuilder =
    inject(FormBuilder);


  // ==========================
  // DATOS DE ENTRADA
  // ==========================

  readonly sector =
    input<Sector | null>(null);

  readonly isSaving =
    input(false);


  // ==========================
  // EVENTOS
  // ==========================

  readonly close =
    output<void>();

  readonly create =
    output<CreateSectorRequest>();

  readonly update =
    output<{
      id: number;
      data: UpdateSectorRequest;
    }>();


  // ==========================
  // FORMULARIO
  // ==========================

  readonly sectorForm =
    this.formBuilder.nonNullable.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],

      description: [
        '',
      ],

      type: [
        'ENTRADA_SALIDA' as SectorType,
        [
          Validators.required,
        ],
      ],

      status: [
        'ACTIVE' as SectorStatus,
      ],
    });


  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor() {
    effect(() => {
      const sector =
        this.sector();

      if (sector) {
        this.sectorForm.setValue({
          name:
            sector.name,

          description:
            sector.description ?? '',

          type:
            sector.type,

          status:
            sector.status,
        });

        return;
      }

      this.sectorForm.reset({
        name: '',
        description: '',
        type: 'ENTRADA_SALIDA',
        status: 'ACTIVE',
      });
    });
  }


  // ==========================
  // MODO EDICION
  // ==========================

  isEditMode(): boolean {
    return this.sector() !== null;
  }


  // ==========================
  // GUARDAR
  // ==========================

  submit(): void {
    if (this.sectorForm.invalid) {
      this.sectorForm.markAllAsTouched();

      return;
    }

    const values =
      this.sectorForm.getRawValue();

    const currentSector =
      this.sector();


    // ==========================
    // EDITAR
    // ==========================

    if (currentSector) {
      this.update.emit({
        id: currentSector.id,

        data: {
          name:
            values.name.trim(),

          description:
            values.description.trim(),

          type:
            values.type,

          status:
            values.status,
        },
      });

      return;
    }


    // ==========================
    // CREAR
    // ==========================

    this.create.emit({
      name:
        values.name.trim(),

      description:
        values.description.trim(),

      type:
        values.type,
    });
  }


  // ==========================
  // CERRAR
  // ==========================

  closeModal(): void {
    if (this.isSaving()) {
      return;
    }

    this.close.emit();
  }
}
