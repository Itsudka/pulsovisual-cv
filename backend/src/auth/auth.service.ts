import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
) {}

  // ==========================
  // REGISTRO
  // ==========================

    async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create(
      registerDto.name.trim(),
      email,
      passwordHash,
    );

    return {
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };


    }


    // ==========================
    // LOGIN
    // ==========================

    async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'El usuario se encuentra inactivo',
      );
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos',
      );
    }

    // ==========================
    // PAYLOAD JWT
    // ==========================

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    }

    // ==========================
    // PERFIL
    // ==========================

    async getProfile(userId: number) {
        const user = await this.usersService.findById(userId);

    if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
    }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
        };
    }
}