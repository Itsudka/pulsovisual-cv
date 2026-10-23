import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAnalysisDto {
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
  @IsNotEmpty()
  @MaxLength(255)
  originalFilename!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  videoDurationSeconds?: number;

  @IsString()
  @IsIn([
    'HORIZONTAL',
    'VERTICAL',
  ])
  flowLineOrientation!: string;

  @IsInt()
  @Min(0)
  flowLinePosition!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  flowTolerancePx?: number;
}