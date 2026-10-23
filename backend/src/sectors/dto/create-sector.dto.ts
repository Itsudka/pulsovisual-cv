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
    'CAJAS',
    'OTRO',
  ])
  type!: string;
}