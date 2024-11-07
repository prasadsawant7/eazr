import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthService } from './auth.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { AuthResponse, Tokens } from '../types';
import { RTGuard } from 'src/common/guards';
import { LocalAuthSigninDTO, LocalAuthSignupDTO } from '../dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Local Auth')
@Controller('auth/local')
export class LocalAuthController {
  constructor(private localAuthService: LocalAuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: LocalAuthSignupDTO): Promise<AuthResponse> {
    return this.localAuthService.signupLocal(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: LocalAuthSigninDTO): Promise<AuthResponse> {
    return this.localAuthService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.localAuthService.logout(userId);
  }

  @Public()
  @UseGuards(RTGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.localAuthService.refreshTokens(userId, refreshToken);
  }
}
