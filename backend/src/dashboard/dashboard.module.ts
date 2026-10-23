import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AuthModule } from '../auth/auth.module';


import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Sector } from '../sectors/entity.ts/sector.entity';
import { Analysis } from '../analyses/entity/analysis.entity';
import { Metric } from '../metrics/entity/metric.entity';

@Module({
  imports: [
    // ==========================
    // REPOSITORIOS
    // ==========================

    TypeOrmModule.forFeature([
      Sector,
      Analysis,
      Metric,
    ]),

    // ==========================
    // AUTENTICACION
    // ==========================

    AuthModule,
  ],

  controllers: [
    DashboardController,
  ],

  providers: [
    DashboardService,
  ],
})
export class DashboardModule {}