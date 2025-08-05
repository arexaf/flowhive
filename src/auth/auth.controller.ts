import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/login.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const userExists = await this.authService.findByEmail(registerDto.email);
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    return this.authService.register(registerDto);
  }

  // Login existing user
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { access_token: token };
  }
}
