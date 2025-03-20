import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserRole } from '../../model/UserRole';

export const roleGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService); // Correctly inject AuthService


  return authService.getAuthUser().pipe(
    map((user) => {
      // Check if the user has the 'admin' role
      if (user?.role ===  UserRole.MEDICINE) {
        return true;
      }
      return false;
    })
  );
};
