import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
   canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      return !!request.currentUser;
   }
}