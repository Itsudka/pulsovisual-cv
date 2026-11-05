import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

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

    // ==========================
    // VERIFICAR CLOUDFLARE
    // ==========================

    await this.verifyTurnstile(registerDto.turnstileToken);

    // ==========================
    // VALIDAR CORREO
    // ==========================

    const email = registerDto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'El correo electrónico ya está registrado'
      );
    }

    // ==========================
    // GENERAR PASSWORD HASH
    // ==========================

    const passwordHash = await bcrypt.hash(
      registerDto.password,
      10
    );

    // ==========================
    // CREAR USUARIO
    // ==========================

    const user = await this.usersService.create(
      registerDto.name.trim(),
      email,
      passwordHash
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
    // ==========================
    // VERIFICAR CLOUDFLARE
    // ==========================

    await this.verifyTurnstile(loginDto.turnstileToken);

    // ==========================
    // VALIDAR CREDENCIALES
    // ==========================

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


  private async verifyTurnstile(token: string): Promise<void> {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      throw new InternalServerErrorException(
        'La verificación de seguridad no está configurada',
      );
    }

    // ==========================
    // CONSULTAR CLOUDFLARE
    // ==========================

    let response: Response;

    try {
      response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            secret,
            response: token,
          }),

          signal: AbortSignal.timeout(5000),
        },
      );
    } catch {
      throw new ServiceUnavailableException(
        'No fue posible conectar con la verificación de seguridad',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'El servicio de verificación no está disponible',
      );
    }

    // ==========================
    // VALIDAR RESPUESTA
    // ==========================

    let result: { success: boolean };

    try {
      result = await response.json() as { success: boolean };
    } catch {
      throw new ServiceUnavailableException(
        'Respuesta inválida del servicio de verificación',
      );
    }

    if (result.success !== true) {
      throw new BadRequestException(
        'La verificación de seguridad es inválida o ha expirado',
      );
    }
  }

}