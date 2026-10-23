import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { CreateSectorDto } from './dto/create-sector.dto';
import { SectorsService } from './sectors.service';
import { Sector } from './entity.ts/sector.entity';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Controller('sectors')
export class SectorsController {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    private readonly sectorsService: SectorsService,
  ) {}

  // ==========================
  // CREAR SECTOR
  // ==========================

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createSectorDto: CreateSectorDto,
  ) {
    const user = request['user'];

    return this.sectorsService.create(
      user.sub,
      createSectorDto,
    );
  }

    // LISTAR SECTORES

    @UseGuards(AuthGuard)
    @Get()
    findAll(@Req() request: Request) {
    const user = request['user'];

    return this.sectorsService.findAllByUser(user.sub);
    }


    // ==========================
    // OBTENER SECTOR POR ID
    // ==========================

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    ) {
    const user = request['user'];

    return this.sectorsService.findOneByUser(
        user.sub,
        id,
    );
    }

    // ==========================
    // ACTUALIZAR SECTOR
    // ==========================

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectorDto: UpdateSectorDto,
    ) {
    const user = request['user'];

    return this.sectorsService.update(
        user.sub,
        id,
        updateSectorDto,
    );
    }

    // ==========================
    // ELIMINAR SECTOR
    // ==========================

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    ) {
    const user = request['user'];

    return this.sectorsService.remove(
        user.sub,
        id,
    );
    }

    

  
}