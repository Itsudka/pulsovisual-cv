import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AnalysesModule } from '../analyses/analyses.module';

import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { Metric } from './entity/metric.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([Metric]),
    AuthModule,
    AnalysesModule,
  ],

  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [ MetricsService,],
})
export class MetricsModule {}