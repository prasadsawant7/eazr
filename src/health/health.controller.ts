import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/')
  getServerHealth() {
    return { message: 'Server is up and running!' };
  }
}
