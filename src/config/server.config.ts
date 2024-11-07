import { registerAs } from '@nestjs/config';

export default registerAs('serverConfig', () => ({
  domainName: process.env.SERVER_DOMAIN_NAME,
  port: +process.env.SERVER_PORT,
  url: process.env.SERVER_URL,
}));
