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
import {
  StorageService,
} from '../storage/storage.service'

const execFileAsync = promisify(execFile);


// ==========================
// RESULTADO DE PYTHON
// ==========================

interface ProcessingResult {
  detectedTrackCount: number;
  flowUpCount: number;
  flowDownCount: number;
  averageDwellSeconds: number;
  outputVideoPath: string | null;
  trajectoriesPath: string;
}


@Injectable()
export class ProcessingService {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    private readonly analysesService: AnalysesService,
    private readonly metricsService: MetricsService,
    private readonly storageService: StorageService,
  ) {}


  // ==========================
  // EJECUTAR PYTHON
  // ==========================

  async processVideo(
    videoPath: string,
    flowLinePosition: number,
    flowTolerance: number,
    analysisId: number,
  ): Promise<ProcessingResult> {

    // ==========================
    // DIRECTORIO DE CV
    // ==========================

    const cvDirectory =
      process.env.CV_DIRECTORY
        ? resolve(
            process.env.CV_DIRECTORY,
          )
        : resolve(
            process.cwd(),
            '..',
            'cv',
          );
    
    // ==========================
    // VIDEO PROCESADO
    // ==========================

    const outputVideoPath =
      resolve(
        cvDirectory,
        'output',
        `analysis-${analysisId}.mp4`,
      );

    const trajectoriesPath = resolve(
      cvDirectory,
      'output',
      `analysis-${analysisId}-trajectories.json`,
    );

    // ==========================
    // SCRIPT
    // ==========================

    const scriptPath =
      resolve(
        cvDirectory,
        'main.py',
      );


    // ==========================
    // EJECUTABLE DE PYTHON
    // ==========================

    const pythonExecutable =
      process.env.PYTHON_EXECUTABLE
        ?? (
          process.platform === 'win32'
            ? 'python'
            : 'python3'
        );


    try {
      const {
        stdout,
        stderr,
      } = await execFileAsync(
        pythonExecutable,
        [
          scriptPath,
          videoPath,
          '--headless',
          '--flow-line-position',
          String(
            flowLinePosition,
          ),
          '--flow-tolerance',
          String(
            flowTolerance,
          ),
          '--output-video',
          outputVideoPath,
          '--trajectories-output',
          trajectoriesPath,
        ],
        {
          cwd:
            cvDirectory,

          maxBuffer:
            10 * 1024 * 1024,
        },
      );


      // ==========================
      // LOGS DE PYTHON
      // ==========================

      if (stderr) {
        console.log(
          stderr,
        );
      }

      // ==========================
      // RESULTADO
      // ==========================

      const outputLines =
        stdout
          .trim()
          .split(/\r?\n/)
          .map(
            (line) =>
              line.trim(),
          )
          .filter(Boolean);


      // ==========================
      // BUSCAR JSON FINAL
      // ==========================

      const jsonLine =
        [...outputLines]
          .reverse()
          .find(
            (line) =>
              line.startsWith('{') &&
              line.endsWith('}'),
          );


      if (!jsonLine) {
        console.error(
          'SALIDA COMPLETA DE PYTHON:',
          stdout,
        );

        throw new Error(
          'Python no devolvió un resultado JSON válido',
        );
      }


      return JSON.parse(
        jsonLine,
      ) as ProcessingResult;

      
    } catch (error) {
      console.error(
        'ERROR AL EJECUTAR PYTHON:',
        error,
      );

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
        analysis.id,
      );

      console.log(
        'VIDEO PROCESADO:',
        result.outputVideoPath,
      );

      console.log(
        'TRAYECTORIAS GENERADAS:',
        result.trajectoriesPath,
      );

      // ==========================
      // GUARDAR VIDEO PROCESADO
      // ==========================

      if (result.outputVideoPath) {

        const outputVideoKey =
          `analyses/${analysis.id}/output.mp4`;


        await this.storageService.uploadVideo(
          result.outputVideoPath,
          outputVideoKey,
        );


        await this.analysesService.updateOutputVideoKey(
          analysis.id,
          outputVideoKey,
        );


        console.log(
          'VIDEO SUBIDO:',
          outputVideoKey,
        );
      }

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


      // ==========================
      // GUARDAR TRAYECTORIAS EN S3
      // ==========================

      if (result.trajectoriesPath) {

        const trajectoriesKey =
          `analyses/${analysis.id}/trajectories.json`;

        await this.storageService.uploadTrajectories(
          result.trajectoriesPath,
          trajectoriesKey,
        );

        // ==========================
        // GUARDAR REFERENCIA EN BD
        // ==========================

        await this.analysesService.updateTrajectoriesKey(
          analysis.id,
          trajectoriesKey,
        );

        console.log(
          'TRAYECTORIAS SUBIDAS:',
          trajectoriesKey,
        );
      }

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

    } 
    finally {

      // ==========================
      // RUTAS DE ARCHIVOS TEMPORALES
      // ==========================

      const temporaryFiles = [
        file.path,
      ];

      if (analysisId !== null) {

        const cvDirectory =
          process.env.CV_DIRECTORY
            ? resolve(process.env.CV_DIRECTORY)
            : resolve(process.cwd(), '..', 'cv');

        const outputDirectory = resolve(
          cvDirectory,
          'output',
        );

        temporaryFiles.push(
          resolve(
            outputDirectory,
            `analysis-${analysisId}.mp4`,
          ),
          resolve(
            outputDirectory,
            `analysis-${analysisId}-raw.mp4`,
          ),
          resolve(
            outputDirectory,
            `analysis-${analysisId}-trajectories.json`,
          ),
        );
      }

      // ==========================
      // ELIMINAR ARCHIVOS
      // ==========================

      for (const temporaryFile of temporaryFiles) {

        try {
          await unlink(temporaryFile);

          console.log(
            'ARCHIVO TEMPORAL ELIMINADO:',
            temporaryFile,
          );

        } catch (error) {

          if (
            (error as NodeJS.ErrnoException).code !== 'ENOENT'
          ) {
            console.error(
              'ERROR AL ELIMINAR ARCHIVO TEMPORAL:',
              temporaryFile,
              error,
            );
          }
        }
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