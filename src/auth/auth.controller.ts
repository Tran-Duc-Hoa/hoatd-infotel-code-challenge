import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtService } from '@nestjs/jwt';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Login',
    description: 'Login with email and password',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'This endpoint requires a `refresh_token` cookie to generate new tokens.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({ status: 200, description: 'Success' })
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(req, res);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Redirect after logging with Google',
    description:
      'Google will return the response after authenticating a user to this endpoint',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(req, res);
  }
}
