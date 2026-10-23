import { Module } from '@nestjs/common';

import { AnalysesModule } from '../analyses/analyses.module';
import { AuthModule } from '../auth/auth.module';
import { MetricsModule } from '../metrics/metrics.module';

import { ProcessingService } from './processing.service';
import { AnalysisProcessingController } from './analysis-processing.controller';

@Module({
  imports: [
    // ==========================
    // MODULOS
    // ==========================

    AuthModule,
    AnalysesModule,
    MetricsModule,
  ],

  controllers: [
    // ==========================
    // CONTROLADORES
    // ==========================

    AnalysisProcessingController,
    AnalysisProcessingController,
  ],

  providers: [
    ProcessingService,
  ],

  exports: [
    ProcessingService,
  ],
})
export class ProcessingModule {}