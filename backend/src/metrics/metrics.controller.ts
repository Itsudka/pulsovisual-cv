import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { CreateMetricDto } from './dto/create-metric.dto';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {

  constructor(
    private readonly metricsService: MetricsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createMetricDto: CreateMetricDto,
  ) {
    const user = request['user'];

    return this.metricsService.create(
      user.sub,
      createMetricDto,
    );
  }
}