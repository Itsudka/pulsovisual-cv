import {
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateMetricDto {

  @IsInt()
  @Min(1)
  analysisId!: number;

  @IsInt()
  @Min(0)
  detectedTrackCount!: number;

  @IsInt()
  @Min(0)
  flowUpCount!: number;

  @IsInt()
  @Min(0)
  flowDownCount!: number;

  @IsNumber()
  @Min(0)
  averageDwellSeconds!: number;
}