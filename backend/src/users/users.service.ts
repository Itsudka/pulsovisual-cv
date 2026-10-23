import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';



@Injectable()
export class UsersService {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ==========================
  // CREAR USUARIO
  // ==========================

  async create(
    name: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      name,
      email,
      passwordHash,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  // ==========================
  // BUSCAR POR EMAIL
  // ==========================

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  // ==========================
  // BUSCAR POR ID
  // ==========================

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }
}