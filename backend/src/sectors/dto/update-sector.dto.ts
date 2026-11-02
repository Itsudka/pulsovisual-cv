import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateSectorDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsString()
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
  type?: string;


  @IsOptional()
  @IsString()
  @IsIn([
    'ACTIVE',
    'IN_REVIEW',
    'INACTIVE',
  ])
  status?: string;
}