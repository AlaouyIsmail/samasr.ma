import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() name: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
}
class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new agent' })
  register(@Body() dto: RegisterDto) {
    return this.svc.register(dto.email, dto.password, dto.name, dto.phone, dto.city);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login — returns JWT token' })
  login(@Body() dto: LoginDto) {
    return this.svc.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user + agent profile' })
  me(@Request() req) {
    return this.svc.me(req.user.id);
  }
}
