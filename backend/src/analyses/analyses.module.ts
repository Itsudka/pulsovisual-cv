import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { SectorsModule } from '../sectors/sectors.module';

import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { Analysis } from './entity/analysis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analysis]),

    AuthModule,
    SectorsModule,
  ],

  controllers: [AnalysesController],
  providers: [AnalysesService],
  exports: [
    AnalysesService,
  ],
})
export class AnalysesModule {}