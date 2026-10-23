import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../sectors/entity.ts/sector.entity';
import { Analysis } from '../analyses/entity/analysis.entity';
import { Metric } from '../metrics/entity/metric.entity';



@Injectable()
export class DashboardService {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    @InjectRepository(Sector)
    private readonly sectorsRepository: Repository<Sector>,

    @InjectRepository(Analysis)
    private readonly analysesRepository: Repository<Analysis>,

    @InjectRepository(Metric)
    private readonly metricsRepository: Repository<Metric>,
  ) {}


  // ==========================
  // RESUMEN GENERAL
  // ==========================

  async getSummary(userId: number) {
    // ==========================
    // SECTORES REGISTRADOS
    // ==========================

    const sectorsRegistered =
      await this.sectorsRepository.count({
        where: {
          userId,
        },
      });


    // ==========================
    // SECTORES ACTIVOS
    // ==========================

    const activeSectors =
      await this.sectorsRepository.count({
        where: {
          userId,
          status: 'ACTIVE',
        },
      });


    // ==========================
    // TOTAL DE ANALISIS
    // ==========================

    const totalAnalyses =
      await this.analysesRepository
        .createQueryBuilder('analysis')
        .innerJoin(
          'analysis.sector',
          'sector',
        )
        .where(
          'sector.user_id = :userId',
          {
            userId,
          },
        )
        .getCount();


    // ==========================
    // ANALISIS COMPLETADOS
    // ==========================

    const completedAnalyses =
      await this.analysesRepository
        .createQueryBuilder('analysis')
        .innerJoin(
          'analysis.sector',
          'sector',
        )
        .where(
          'sector.user_id = :userId',
          {
            userId,
          },
        )
        .andWhere(
          'analysis.status = :status',
          {
            status: 'COMPLETED',
          },
        )
        .getCount();


    // ==========================
    // METRICAS GENERALES
    // ==========================

    const metrics =
      await this.metricsRepository
        .createQueryBuilder('metric')
        .innerJoin(
          'metric.analysis',
          'analysis',
        )
        .innerJoin(
          'analysis.sector',
          'sector',
        )
        .select(
          'COALESCE(SUM(metric.detected_track_count), 0)',
          'detectedTrackCount',
        )
        .addSelect(
          'COALESCE(AVG(metric.average_dwell_seconds), 0)',
          'averageDwellSeconds',
        )
        .where(
          'sector.user_id = :userId',
          {
            userId,
          },
        )
        .getRawOne<{
          detectedTrackCount: string;
          averageDwellSeconds: string;
        }>();


    // ==========================
    // RESPUESTA
    // ==========================

    return {
      sectorsRegistered,
      activeSectors,
      totalAnalyses,
      completedAnalyses,

      detectedTrackCount:
        Number(
          metrics?.detectedTrackCount ?? 0,
        ),

      averageDwellSeconds:
        Number(
          Number(
            metrics?.averageDwellSeconds ?? 0,
          ).toFixed(2),
        ),
    };
  }

  // ==========================
    // ACTIVIDAD POR FECHA
    // ==========================

    async getActivityByDate(userId: number) {
    const results =
        await this.metricsRepository
        .createQueryBuilder('metric')
        .innerJoin(
            'metric.analysis',
            'analysis',
        )
        .innerJoin(
            'analysis.sector',
            'sector',
        )
        .select(
            "TO_CHAR(analysis.recorded_at, 'YYYY-MM-DD')",
            'date',
        )
        .addSelect(
            'SUM(metric.detected_track_count)',
            'detectedTrackCount',
        )
        .where(
            'sector.user_id = :userId',
            {
            userId,
            },
        )
        .andWhere(
            'analysis.status = :status',
            {
            status: 'COMPLETED',
            },
        )
        .groupBy(
            "TO_CHAR(analysis.recorded_at, 'YYYY-MM-DD')",
        )
        .orderBy(
            "TO_CHAR(analysis.recorded_at, 'YYYY-MM-DD')",
            'ASC',
        )
        .getRawMany<{
            date: string;
            detectedTrackCount: string;
        }>();

    return results.map(
        (result) => ({
        date: result.date,

        detectedTrackCount:
            Number(
            result.detectedTrackCount,
            ),
        }),
    );
    }

    // ==========================
    // ESTADISTICAS POR SECTOR
    // ==========================

    async getSectorStats(userId: number) {
    const results =
        await this.metricsRepository
        .createQueryBuilder('metric')
        .innerJoin(
            'metric.analysis',
            'analysis',
        )
        .innerJoin(
            'analysis.sector',
            'sector',
        )
        .select(
            'sector.id',
            'sectorId',
        )
        .addSelect(
            'sector.name',
            'sectorName',
        )
        .addSelect(
            'COUNT(analysis.id)',
            'analysisCount',
        )
        .addSelect(
            'COALESCE(SUM(metric.detected_track_count), 0)',
            'detectedTrackCount',
        )
        .addSelect(
            'COALESCE(AVG(metric.average_dwell_seconds), 0)',
            'averageDwellSeconds',
        )
        .where(
            'sector.user_id = :userId',
            {
            userId,
            },
        )
        .andWhere(
            'analysis.status = :status',
            {
            status: 'COMPLETED',
            },
        )
        .groupBy(
            'sector.id',
        )
        .addGroupBy(
            'sector.name',
        )
        .orderBy(
            'sector.name',
            'ASC',
        )
        .getRawMany<{
            sectorId: string;
            sectorName: string;
            analysisCount: string;
            detectedTrackCount: string;
            averageDwellSeconds: string;
        }>();

    return results.map(
        (result) => ({
        sectorId:
            Number(
            result.sectorId,
            ),

        sectorName:
            result.sectorName,

        analysisCount:
            Number(
            result.analysisCount,
            ),

        detectedTrackCount:
            Number(
            result.detectedTrackCount,
            ),

        averageDwellSeconds:
            Number(
            Number(
                result.averageDwellSeconds,
            ).toFixed(2),
            ),
        }),
    );
    }

    // ==========================
    // ACTIVIDAD POR HORA
    // ==========================

    async getHourlyActivity(userId: number) {
    const results =
        await this.metricsRepository
        .createQueryBuilder('metric')
        .innerJoin(
            'metric.analysis',
            'analysis',
        )
        .innerJoin(
            'analysis.sector',
            'sector',
        )
        .select(
            'EXTRACT(HOUR FROM analysis.recorded_at)',
            'hour',
        )
        .addSelect(
            'SUM(metric.detected_track_count)',
            'detectedTrackCount',
        )
        .addSelect(
            'COUNT(analysis.id)',
            'analysisCount',
        )
        .where(
            'sector.user_id = :userId',
            {
            userId,
            },
        )
        .andWhere(
            'analysis.status = :status',
            {
            status: 'COMPLETED',
            },
        )
        .groupBy(
            'EXTRACT(HOUR FROM analysis.recorded_at)',
        )
        .orderBy(
            'EXTRACT(HOUR FROM analysis.recorded_at)',
            'ASC',
        )
        .getRawMany<{
            hour: string;
            detectedTrackCount: string;
            analysisCount: string;
        }>();


    // ==========================
    // NORMALIZAR RESULTADOS
    // ==========================

    const hourlyActivity = results.map(
        (result) => ({
        hour: Number(
            result.hour,
        ),

        detectedTrackCount:
            Number(
            result.detectedTrackCount,
            ),

        analysisCount:
            Number(
            result.analysisCount,
            ),
        }),
    );


    // ==========================
    // SIN DATOS
    // ==========================

    if (hourlyActivity.length === 0) {
        return {
        hourlyActivity: [],
        peakHour: null,
        valleyHour: null,
        };
    }


    // ==========================
    // HORA PICO
    // ==========================

    const peakHour = hourlyActivity.reduce(
        (highest, current) =>
        current.detectedTrackCount >
        highest.detectedTrackCount
            ? current
            : highest,
    );


    // ==========================
    // HORA VALLE
    // ==========================

    const valleyHour = hourlyActivity.reduce(
        (lowest, current) =>
        current.detectedTrackCount <
        lowest.detectedTrackCount
            ? current
            : lowest,
    );


    // ==========================
    // RESPUESTA
    // ==========================

    return {
        hourlyActivity,
        peakHour,
        valleyHour,
    };
    }




}