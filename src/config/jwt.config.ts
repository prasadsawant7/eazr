import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  atSecret: process.env.AT_SECRET,
  rtSecret: process.env.RT_SECRET,
}));
