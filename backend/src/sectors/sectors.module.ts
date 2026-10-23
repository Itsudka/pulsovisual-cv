import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { Sector } from './entity.ts/sector.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sector]),
    AuthModule,
  ],
  exports: [
    SectorsService,
  ],
  controllers: [SectorsController],
  providers: [SectorsService],
})
export class SectorsModule {}