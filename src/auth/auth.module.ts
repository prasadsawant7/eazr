import { Module } from '@nestjs/common';
import { LocalAuthController } from './local/auth.controller';
import { LocalAuthService } from './local/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ATStrategy, RTStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  providers: [LocalAuthService, ATStrategy, RTStrategy],
  controllers: [LocalAuthController],
})
export class AuthModule {}
