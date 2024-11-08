import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/common/decorators';

@Controller('health')
export class HealthController {
  @Public()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getServerHealth() {
    return { message: 'Server is up and running!' };
  }
}
