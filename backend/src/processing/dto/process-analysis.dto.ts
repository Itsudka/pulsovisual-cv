import { Type } from 'class-transformer';

import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ProcessAnalysisDto {

  @Type(() => Number)
  @IsInt()
  @Min(1)
  sectorId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsDateString()
  recordedAt!: string;

  @IsString()
  @IsIn(['HORIZONTAL'])
  flowLineOrientation!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  flowLinePosition!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  flowTolerancePx?: number;
}