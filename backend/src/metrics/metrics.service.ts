import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnalysesService } from '../analyses/analyses.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Metric } from './entity/metric.entity';


@Injectable()
export class MetricsService {

  constructor(
    @InjectRepository(Metric)
    private readonly metricsRepository: Repository<Metric>,

    private readonly analysesService: AnalysesService,
  ) {}

  async create(
    userId: number,
    createMetricDto: CreateMetricDto,
  ): Promise<Metric> {

    // ==========================
    // VALIDAR ANALISIS
    // ==========================

    await this.analysesService.findOneByUser(
    userId,
    createMetricDto.analysisId,
    );

    const existingMetric =
      await this.metricsRepository.findOne({
        where: {
          analysisId: createMetricDto.analysisId,
        },
      });

    if (existingMetric) {
      throw new ConflictException(
        'El análisis ya tiene métricas registradas',
      );
    }

    const metric = this.metricsRepository.create({
      analysisId: createMetricDto.analysisId,
      detectedTrackCount:
        createMetricDto.detectedTrackCount,
      flowUpCount:
        createMetricDto.flowUpCount,
      flowDownCount:
        createMetricDto.flowDownCount,
      averageDwellSeconds:
        createMetricDto.averageDwellSeconds,
    });


    // ==========================
    // GUARDAR METRICAS
    // ==========================

    const savedMetric =
    await this.metricsRepository.save(metric);

    // ==========================
    // COMPLETAR ANALISIS
    // ==========================

    await this.analysesService.markAsCompleted(
    createMetricDto.analysisId,
    );

    return savedMetric;
  }
}