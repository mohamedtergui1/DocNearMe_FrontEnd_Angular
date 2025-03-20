import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../../pages/service/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateChildFn = (childRoute, state) => {
  AuthService:AuthService = inject(AuthService);

  
  return true;
};
