import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSectorDto {
  // ==========================
  // NOMBRE
  // ==========================

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  // ==========================
  // DESCRIPCION
  // ==========================

  @IsOptional()
  @IsString()
  description?: string;

  // ==========================
  // TIPO
  // ==========================

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'ENTRADA_SALIDA',
    'PASILLO',
    'ALMACEN',
    'ZONA_ATENCION',
    'ZONA_ESPERA',
    'AREA_EXHIBICION',
    'COMEDOR',
    'ESTACIONAMIENTO',
    'ESCALERAS_ASCENSORES',
    'OTRO',
  ])
  type!: string;
}