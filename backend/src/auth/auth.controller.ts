import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  // ==========================
  // CONSTRUCTOR
  // ==========================

  constructor(private readonly authService: AuthService) {}

  // ==========================
  // REGISTRO
  // ==========================

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

    // ==========================
    // LOGIN
    // ==========================


    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // ==========================
    // PERFIL
    // ==========================

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() request: Request) {
    const user = request['user'];

    return this.authService.getProfile(user.sub);
    }
}