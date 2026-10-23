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
    'CAJAS',
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