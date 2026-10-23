import { Type } from 'class-transformer';

import {
  IsIn,
  IsInt,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';

export class AnalysisFiltersDto {
  // ==========================
  // SECTOR
  // ==========================

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sectorId?: number;

  // ==========================
  // ESTADO
  // ==========================

  @IsOptional()
  @IsIn([
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
  ])
  status?: string;

  // ==========================
  // FECHA DESDE
  // ==========================

  @IsOptional()
  @Matches(
    /^\d{4}-\d{2}-\d{2}$/,
    {
      message:
        'dateFrom debe tener formato YYYY-MM-DD',
    },
  )
  dateFrom?: string;

  // ==========================
  // FECHA HASTA
  // ==========================

  @IsOptional()
  @Matches(
    /^\d{4}-\d{2}-\d{2}$/,
    {
      message:
        'dateTo debe tener formato YYYY-MM-DD',
    },
  )
  dateTo?: string;
}