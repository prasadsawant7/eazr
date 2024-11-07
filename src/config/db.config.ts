import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => ({
  url: process.env.DATABASE_URL,
}));
