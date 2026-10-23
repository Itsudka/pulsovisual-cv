import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SectorsService } from '../sectors/sectors.service';
import { Analysis } from './entity/analysis.entity';
import { CreateAnalysisDto } from './dto.ts/create-analysis.dto';
import { AnalysisFiltersDto } from './dto.ts/analysis-filters.dto';



@Injectable()
export class AnalysesService {

  constructor(
    @InjectRepository(Analysis)
    private readonly analysesRepository: Repository<Analysis>,

    private readonly sectorsService: SectorsService,
  ) {}

  async create(
    userId: number,
    createAnalysisDto: CreateAnalysisDto,
  ): Promise<Analysis> {

    await this.sectorsService.findOneByUser(
      userId,
      createAnalysisDto.sectorId,
    );

    const analysis = this.analysesRepository.create({
      sectorId: createAnalysisDto.sectorId,
      name: createAnalysisDto.name.trim(),
      recordedAt: new Date(createAnalysisDto.recordedAt),
      originalFilename: createAnalysisDto.originalFilename.trim(),
      videoDurationSeconds:
        createAnalysisDto.videoDurationSeconds ?? null,
      status: 'PENDING',
      flowLineOrientation: createAnalysisDto.flowLineOrientation,
      flowLinePosition: createAnalysisDto.flowLinePosition,
      flowTolerancePx:
        createAnalysisDto.flowTolerancePx ?? 10,
      processedAt: null,
    });

    return this.analysesRepository.save(analysis);
  }


  // ==========================
  // LISTAR ANALISIS DEL USUARIO
  // ==========================

  async findAllByUser(
    userId: number,
    filters: AnalysisFiltersDto,
  ): Promise<Analysis[]> {
    // ==========================
    // CONSULTA BASE
    // ==========================

    const query = this.analysesRepository
      .createQueryBuilder('analysis')
      .innerJoinAndSelect(
        'analysis.sector',
        'sector',
      )
      .leftJoinAndSelect(
        'analysis.metric',
        'metric',
      )
      .where(
        'sector.user_id = :userId',
        {
          userId,
        },
      );


    // ==========================
    // FILTRO POR SECTOR
    // ==========================

    if (filters.sectorId !== undefined) {
      query.andWhere(
        'analysis.sector_id = :sectorId',
        {
          sectorId: filters.sectorId,
        },
      );
    }


    // ==========================
    // FILTRO POR ESTADO
    // ==========================

    if (filters.status !== undefined) {
      query.andWhere(
        'analysis.status = :status',
        {
          status: filters.status,
        },
      );
    }


    // ==========================
    // FILTRO FECHA DESDE
    // ==========================

    if (filters.dateFrom !== undefined) {
      query.andWhere(
        'analysis.recorded_at >= :dateFrom',
        {
          dateFrom:
            `${filters.dateFrom} 00:00:00`,
        },
      );
    }


    // ==========================
    // FILTRO FECHA HASTA
    // ==========================

    if (filters.dateTo !== undefined) {
      query.andWhere(
        'analysis.recorded_at <= :dateTo',
        {
          dateTo:
            `${filters.dateTo} 23:59:59.999`,
        },
      );
    }


    // ==========================
    // ORDEN
    // ==========================

    query.orderBy(
      'analysis.recorded_at',
      'DESC',
    );


    // ==========================
    // RESULTADO
    // ==========================

    return query.getMany();
  }


  // ==========================
  // BUSCAR ANALISIS POR ID
  // ==========================

  async findOneByUser(
    userId: number,
    analysisId: number,
  ): Promise<Analysis> {
    const analysis = await this.analysesRepository.findOne({
      where: {
        id: analysisId,
        sector: {
          userId,
        },
      },

      relations: {
        sector: true,
        metric: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException('Análisis no encontrado');
    }

    return analysis;
  }

  // ==========================
  // MARCAR ANALISIS COMPLETADO
  // ==========================

  async markAsCompleted(analysisId: number): Promise<void> {
    await this.analysesRepository.update(
      analysisId,
      {
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    );
  }

  // ==========================
  // MARCAR COMO PROCESANDO
  // ==========================

  async markAsProcessing(
    analysisId: number,
  ): Promise<void> {
    await this.analysesRepository.update(
      analysisId,
      {
        status: 'PROCESSING',
        processedAt: null,
      },
    );
  }


  // ==========================
  // MARCAR COMO FALLIDO
  // ==========================

  async markAsFailed(
    analysisId: number,
  ): Promise<void> {
    await this.analysesRepository.update(
      analysisId,
      {
        status: 'FAILED',
        processedAt: null,
      },
    );
  }



















}