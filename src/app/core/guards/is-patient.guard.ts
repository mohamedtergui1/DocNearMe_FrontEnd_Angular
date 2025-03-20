import { CanActivateChildFn } from '@angular/router';
import { UserRole } from '../../model/UserRole';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const isPatientGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);

  return authService.getAuthUser().pipe(
    map((user) => {

      if (user?.role ===  UserRole.PATIENT) {
        return true;
      }
      return false;
    })
  );
};
