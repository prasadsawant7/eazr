import { Role } from '@prisma/client';

export type AuthResponse = {
  user_id: string;
  user_email: string;
  user_role: Role;
  access_token: string;
  refresh_token: string;
};
