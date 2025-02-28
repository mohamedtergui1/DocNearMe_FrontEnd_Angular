import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../pages/service/auth.service';
import { Inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService:AuthService = Inject(AuthService)

  return authService.isAuthenticated();
};
