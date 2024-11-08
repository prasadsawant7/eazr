import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class AdminLibrarianGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.LIBRARIAN)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
