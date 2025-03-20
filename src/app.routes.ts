import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ProfileComponent } from './app/pages/profile/profile.component';
import { getAuthUserResolver } from './app/core/resolvers/get-auth-user.resolver';
import { DoctorAppointmentComponent } from './app/pages/doctor-appointment/doctor-appointment.component';
import { getClinicForAuthUserResolver } from './app/core/resolvers/get-clinic-for-auth-user.resolver';
import { CreateClinicComponent } from './app/pages/create-clinic/create-clinic.component';
import { BookAppointmentComponent } from './app/pages/book-appointment/book-appointment.component';
import { CreateConsultationComponent } from './app/pages/medcine/dashboard/consultation/create-consultation.component';
import { ViewConsultationComponent } from './app/pages/medcine/dashboard/view-consultation/view-consultation.component';

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
            { path: '', component: Dashboard },
            {
                path: 'profile',
                component: ProfileComponent,
                resolve: {
                    data: getAuthUserResolver
                }
            },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
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
                loadComponent: () => import('./app/pages/medecin-manage-appointment/medecin-manage-appointment.component').then((m) => m.MedecinManageAppointmentComponent),

                resolve: {
                    clinic: getClinicForAuthUserResolver
                }
            },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            {
                path: 'create-consultation-from-appointment/:appointmentId',
                component: CreateConsultationComponent
            },
            {
                path: 'view-consultation-by-appointment-id/:appointmentId',
                component: ViewConsultationComponent
            }
        ],
        resolve: {
            clinic: getClinicForAuthUserResolver
        }
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', component: Notfound }
];
