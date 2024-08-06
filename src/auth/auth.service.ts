import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: User, res: Response) {
    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    this.setAuthCookies(tokenPayload, res);
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const payload = this.jwtService.verify(req.cookies.refresh_token);
      this.setAuthCookies({ _id: payload._id, email: payload.email }, res);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async googleLogin(req: Request, res: Response) {
    if (!req.user) {
      res.status(404).json({ message: 'No user from google' });
    }

    const reqUser = req.user as any;
    let user = await this.usersService.findOne({ email: reqUser.email });
    if (!user) {
      user = await this.usersService.create({ email: reqUser.email });
    }
    this.setAuthCookies(
      { _id: user._id.toHexString(), email: user.email },
      res,
    );
    return user;
  }

  setAuthCookies(tokenPayload: TokenPayload, res: Response) {
    const jwtAccessExpiration = this.configService.getOrThrow(
      'JWT_ACCESS_TOKEN_EXPIRATION',
    );
    const jwtRefreshExpiration = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_EXPIRATION',
    );
    const accessExpireDate = new Date();
    accessExpireDate.setSeconds(
      accessExpireDate.getSeconds() + jwtAccessExpiration,
    );
    const refreshExpireDate = new Date();
    refreshExpireDate.setSeconds(
      refreshExpireDate.getSeconds() + jwtRefreshExpiration,
    );

    const accessToken = this.jwtService.sign(tokenPayload, {
      expiresIn: jwtAccessExpiration,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      expiresIn: jwtRefreshExpiration,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      expires: accessExpireDate,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      expires: refreshExpireDate,
    });
    res.status(200);
  }
}
