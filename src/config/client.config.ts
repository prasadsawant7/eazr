import { registerAs } from '@nestjs/config';

export default registerAs('clientConfig', () => ({
  domainName: process.env.CLIENT_DOMAIN_NAME,
  port: +process.env.CLIENT_PORT,
  url: process.env.CLIENT_URL,
}));
