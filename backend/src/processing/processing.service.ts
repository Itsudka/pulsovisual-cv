import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { execFile } from 'child_process';
import { unlink } from 'fs/promises';
import { resolve } from 'path';
import { promisify } from 'util';

import { AnalysesService } from '../analyses/analyses.service';
import { MetricsService } from '../metrics/metrics.service';
import { ProcessAnalysisDto } from './dto/process-analysis.dto';

const execFileAsync = promisify(execFile);


// ==========================
// RESULTADO DE PYTHON
// ==========================

interface ProcessingResult {
  detectedTrackCount: number;
  flowUpCount: number;
  flowDownCount: number;
  averageDwellSeconds: number;
}


@Injectable()
export class ProcessingService {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    private readonly analysesService: AnalysesService,
    private readonly metricsService: MetricsService,
  ) {}


  // ==========================
  // EJECUTAR PYTHON
  // ==========================

  async processVideo(
    videoPath: string,
    flowLinePosition: number,
    flowTolerance: number,
  ): Promise<ProcessingResult> {
    const cvDirectory = resolve(
      process.cwd(),
      '..',
      'cv',
    );

    const scriptPath = resolve(
      cvDirectory,
      'main.py',
    );

    try {
      const {
        stdout,
        stderr,
      } = await execFileAsync(
        'python',
        [
          scriptPath,
          videoPath,
          '--headless',
          '--flow-line-position',
          String(flowLinePosition),
          '--flow-tolerance',
          String(flowTolerance),
        ],
      );

      // ==========================
      // LOGS DE PYTHON
      // ==========================

      if (stderr) {
        console.log(stderr);
      }

      // ==========================
      // RESULTADO
      // ==========================

      return JSON.parse(
        stdout.trim(),
      ) as ProcessingResult;

    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'No fue posible procesar el video',
      );
    }
  }


  // ==========================
  // PROCESAR ANALISIS COMPLETO
  // ==========================

  async processAnalysis(
    userId: number,
    file: Express.Multer.File,
    processAnalysisDto: ProcessAnalysisDto,
  ) {
    let analysisId: number | null = null;

    try {
      // ==========================
      // CREAR ANALISIS
      // ==========================

      const analysis =
        await this.analysesService.create(
          userId,
          {
            sectorId:
              processAnalysisDto.sectorId,

            name:
              processAnalysisDto.name,

            recordedAt:
              processAnalysisDto.recordedAt,

            originalFilename:
              file.originalname,

            flowLineOrientation:
              processAnalysisDto.flowLineOrientation,

            flowLinePosition:
              processAnalysisDto.flowLinePosition,

            flowTolerancePx:
              processAnalysisDto.flowTolerancePx ?? 10,
          },
        );

      analysisId = analysis.id;


      // ==========================
      // MARCAR COMO PROCESSING
      // ==========================

      await this.analysesService.markAsProcessing(
        analysis.id,
      );


      // ==========================
      // EJECUTAR VISION
      // ==========================

      const result = await this.processVideo(
        file.path,
        processAnalysisDto.flowLinePosition,
        processAnalysisDto.flowTolerancePx ?? 10,
      );


      // ==========================
      // GUARDAR METRICAS
      // ==========================

      await this.metricsService.create(
        userId,
        {
          analysisId:
            analysis.id,

          detectedTrackCount:
            result.detectedTrackCount,

          flowUpCount:
            result.flowUpCount,

          flowDownCount:
            result.flowDownCount,

          averageDwellSeconds:
            result.averageDwellSeconds,
        },
      );

    } catch (error) {
      // ==========================
      // MARCAR COMO FAILED
      // ==========================

      if (analysisId !== null) {
        await this.analysesService.markAsFailed(
          analysisId,
        );
      }

      throw error;

    } finally {
      // ==========================
      // ELIMINAR VIDEO TEMPORAL
      // ==========================

      try {
        await unlink(
          file.path,
        );
      } catch (error) {
        console.error(
          'No fue posible eliminar el video temporal',
          error,
        );
      }
    }


    // ==========================
    // DEVOLVER ANALISIS COMPLETO
    // ==========================

    return this.analysesService.findOneByUser(
      userId,
      analysisId!,
    );
  }
}