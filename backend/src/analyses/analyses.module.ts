import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { SectorsModule } from '../sectors/sectors.module';

import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { Analysis } from './entity/analysis.entity';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analysis]),

    AuthModule,
    SectorsModule,
  ],

  controllers: [AnalysesController],
  providers: [AnalysesService, StorageService,],
  exports: [
    AnalysesService,
  ],
})
export class AnalysesModule {}