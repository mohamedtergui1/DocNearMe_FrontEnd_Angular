import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/medcine/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ProfileComponent } from './app/pages/profile/profile.component';
import { getAuthUserResolver } from './app/core/resolvers/get-auth-user.resolver';
import { DoctorAppointmentComponent } from './app/pages/patient/doctor-appointment/doctor-appointment.component';
import { getClinicForAuthUserResolver } from './app/core/resolvers/get-clinic-for-auth-user.resolver';
import { CreateClinicComponent } from './app/pages/create-clinic/create-clinic.component';
import { BookAppointmentComponent } from './app/pages/patient/book-appointment/book-appointment.component';
import { ViewConsultationComponent } from './app/pages/medcine/dashboard/view-consultation/view-consultation.component';
import { isMedicine } from './app/core/guards/is-medicine';
import { isPatientGuard } from './app/core/guards/is-patient.guard';
import { CreateConsultationComponent } from './app/pages/medcine/consultation/create-consultation.component';
import { PatientCalendarComponent } from './app/pages/patient/patient-calendar/patient-calendar.component';
import { authGuard } from './app/core/guards/auth.guard';
import { UpdateClinicComponent } from './app/pages/medcine/update-clinic/update-clinic.component';
import { PatientDashboardComponent } from './app/pages/patient/patient-dashboard/patient-dashboard.component';

export const appRoutes: Routes = [
    { path: '', component: Landing },
    { path: 'bookApointment/:clinic_id', component: DoctorAppointmentComponent },
    { path: 'ClinicListApointment', component: BookAppointmentComponent },
    {
        path: 'create-clinic',
        component: CreateClinicComponent
    },
    {
        path: 'patient/dashboard',
        component: AppLayout,
        children: [
            { path: '', component: PatientDashboardComponent },
            { path: 'calendar', component: PatientCalendarComponent },
            {
                path: 'profile',
                component: ProfileComponent,
                resolve: {
                    data: getAuthUserResolver
                }
            }

        ]
        ,
        canActivateChild: [isPatientGuard]
    },
    {
        path: 'medcine/dashboard',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            {
                path: 'profile',
                component: ProfileComponent,
                resolve: {
                    data: getAuthUserResolver
                }
            },
            {
                path: 'appointment',
                loadComponent: () => import('./app/pages/medcine/medecin-manage-appointment/medecin-manage-appointment.component').then((m) => m.MedecinManageAppointmentComponent),
                resolve: {
                    clinic: getClinicForAuthUserResolver
                }
            },
            {
                path: 'consultation',
                loadComponent: () => import('./app/pages/medcine/consultation-list/consultation-list.component').then((m) => m.ConsultationListComponent),
                resolve: {
                    clinic: getClinicForAuthUserResolver
                }
            },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            {
                path: 'create-consultation-from-appointment/:appointmentId',
                component: CreateConsultationComponent
            },
            {
                path: 'view-consultation-by-appointment-id/:appointmentId',
                component: ViewConsultationComponent
            }
            ,
            {
                path:'clinic/edit',
                component:UpdateClinicComponent,
                resolve: {
                    clinic: getClinicForAuthUserResolver
                }
            }
        ],
        resolve: {
            clinic: getClinicForAuthUserResolver
        }
        ,
        canActivateChild: [isMedicine]
    },
    {
        path: 'settings',
        component: AppLayout,
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            }
        ],
        canMatch:[authGuard]
    }
    ,
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', component: Notfound }
];
