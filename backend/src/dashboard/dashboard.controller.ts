import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    private readonly dashboardService: DashboardService,
  ) {}


  // ==========================
  // RESUMEN GENERAL
  // ==========================

  @Get('summary')
  getSummary(
    @Req() request: Request,
  ) {
    const user = request['user'];

    return this.dashboardService.getSummary(
      user.sub,
    );
  }

    // ==========================
    // ACTIVIDAD POR FECHA
    // ==========================

    @Get('activity')
    getActivity(
    @Req() request: Request,
    ) {
        const user = request['user'];

        return this.dashboardService.getActivityByDate(
            user.sub,
        );
    }

    // ==========================
    // ESTADISTICAS POR SECTOR
    // ==========================

    @Get('sectors')
    getSectorStats(
    @Req() request: Request,
    ) {
        const user = request['user'];

        return this.dashboardService.getSectorStats(
            user.sub,
        );
    }

    // ==========================
    // ACTIVIDAD POR HORA
    // ==========================

    @Get('hourly')
    getHourlyActivity(
    @Req() request: Request,
    ) {
    const user = request['user'];

    return this.dashboardService.getHourlyActivity(
        user.sub,
    );
    }
}