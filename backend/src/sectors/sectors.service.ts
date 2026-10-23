import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CreateSectorDto } from './dto/create-sector.dto';
import { Sector } from './entity.ts/sector.entity';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Injectable()
export class SectorsService {

  // CONSTRUCTOR


  constructor(
    @InjectRepository(Sector)
    private readonly sectorsRepository: Repository<Sector>,
  ) {}


  // CREAR SECTOR

  async create(
    userId: number,
    createSectorDto: CreateSectorDto,
  ): Promise<Sector> {
    const sector = this.sectorsRepository.create({
      userId,
      name: createSectorDto.name.trim(),
      description: createSectorDto.description?.trim() ?? null,
      type: createSectorDto.type,
      status: 'ACTIVE',
    });

    return this.sectorsRepository.save(sector);
  }

    // LISTAR SECTORES DEL USUARIO


    async findAllByUser(userId: number): Promise<Sector[]> {
    return this.sectorsRepository.find({
        where: {
        userId,
        },
        order: {
        createdAt: 'DESC',
        },
    });
    }

    // ==========================
    // BUSCAR SECTOR POR ID
    // ==========================

    async findOneByUser(
    userId: number,
    sectorId: number,
    ): Promise<Sector> {
    const sector = await this.sectorsRepository.findOne({
        where: {
        id: sectorId,
        userId,
        },
    });

    if (!sector) {
        throw new NotFoundException('Sector no encontrado');
    }

    return sector;
    }


    // ==========================
    // ACTUALIZAR SECTOR
    // ==========================

    async update(
    userId: number,
    sectorId: number,
    updateSectorDto: UpdateSectorDto,
    ): Promise<Sector> {
    const sector = await this.findOneByUser(
        userId,
        sectorId,
    );

    if (updateSectorDto.name !== undefined) {
        sector.name = updateSectorDto.name.trim();
    }

    if (updateSectorDto.description !== undefined) {
        sector.description =
        updateSectorDto.description.trim() || null;
    }

    if (updateSectorDto.type !== undefined) {
        sector.type = updateSectorDto.type;
    }

    if (updateSectorDto.status !== undefined) {
        sector.status = updateSectorDto.status;
    }

    return this.sectorsRepository.save(sector);
    }


    // ==========================
    // ELIMINAR SECTOR
    // ==========================

    async remove(
    userId: number,
    sectorId: number,
    ): Promise<{ message: string }> {
    const sector = await this.findOneByUser(
        userId,
        sectorId,
    );

    await this.sectorsRepository.remove(sector);

    return {
        message: 'Sector eliminado correctamente',
    };
    }
}