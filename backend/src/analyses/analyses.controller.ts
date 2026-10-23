import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisDto } from './dto.ts/create-analysis.dto';
import { AnalysisFiltersDto } from './dto.ts/analysis-filters.dto';


@Controller('analyses')
export class AnalysesController {

  constructor(
    private readonly analysesService: AnalysesService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createAnalysisDto: CreateAnalysisDto,
  ) {
    const user = request['user'];

    return this.analysesService.create(
      user.sub,
      createAnalysisDto,
    );
  }

  // ==========================
  // LISTAR ANALISIS
  // ==========================

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Req() request: Request,
    @Query() filters: AnalysisFiltersDto,
  ) {
    const user = request['user'];

    return this.analysesService.findAllByUser(
      user.sub,
      filters,
    );
  }

    // ==========================
    // OBTENER ANALISIS POR ID
    // ==========================

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    ) {
    const user = request['user'];

    return this.analysesService.findOneByUser(
        user.sub,
        id,
    );
    }




}