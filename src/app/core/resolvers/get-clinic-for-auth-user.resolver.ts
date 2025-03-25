import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ClinicService } from '../services/clinic.service';
import { Clinic } from '../../model/Clinic'; 
import { AnonymousSubject } from 'rxjs/internal/Subject';
export const getClinicForAuthUserResolver: ResolveFn<any> = (route, state) => {
  const router = inject(Router);
  const clinicService = inject(ClinicService);

  return clinicService.getClinicForAuthUser().pipe(
    switchMap((clinic: any) => {
      if (clinic) {
        return of(clinic); 
      } else {
        router.navigate(['/create-clinic']);
        return of(null); 
      }
    }),
    catchError((error) => {
      router.navigate(['/create-clinic']);
      return of(null);
    })
  );
};