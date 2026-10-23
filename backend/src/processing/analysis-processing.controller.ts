import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import type { Request } from 'express';

import { diskStorage } from 'multer';

import {
  extname,
  resolve,
} from 'path';

import { AuthGuard } from '../auth/auth.guard';
import { ProcessAnalysisDto } from './dto/process-analysis.dto';
import { ProcessingService } from './processing.service';


@Controller('analyses')
export class AnalysisProcessingController {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    private readonly processingService: ProcessingService,
  ) {}


  // ==========================
  // PROCESAR ANALISIS
  // ==========================

  @UseGuards(AuthGuard)
  @Post('process')
  @UseInterceptors(
    FileInterceptor(
      'video',
      {
        storage: diskStorage({
          destination: resolve(
            process.cwd(),
            'uploads',
          ),

          filename: (
            request,
            file,
            callback,
          ) => {
            const extension = extname(
              file.originalname,
            );

            const filename = [
              Date.now(),
              Math.round(
                Math.random() * 1_000_000,
              ),
            ].join('-');

            callback(
              null,
              `${filename}${extension}`,
            );
          },
        }),
      },
    ),
  )
  processAnalysis(
    @Req() request: Request,

    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    processAnalysisDto: ProcessAnalysisDto,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Debe enviar un video',
      );
    }

    const user = request['user'];

    return this.processingService.processAnalysis(
      user.sub,
      file,
      processAnalysisDto,
    );
  }
}