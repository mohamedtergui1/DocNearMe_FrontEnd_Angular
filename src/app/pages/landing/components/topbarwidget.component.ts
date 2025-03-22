import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../../shared/componenets/logo/logo.component';
import { map, Observable } from 'rxjs';
import { User } from '../../../model/User';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule , CommonModule , LogoComponent],
    template: `
            <app-logo />
        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/'], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/'], { fragment: 'features' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Features</span>
                    </a>
                </li>
                <li  *ngIf="authUser && authUser.role == 'PATIENT'">
                    <a (click)="router.navigate(['/ClinicListApointment'], { fragment: 'highlights' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Book Consultaion</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate([authUser.role == 'MEDICINE' ? 'medcine/dashboard' : 'pateint/dashboard'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Dashboard</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <ng-container *ngIf="isAuth(); else showLoginRegister">
                    <button pButton pRipple label="Logout" (click)="logout()" [rounded]="true"></button>
                </ng-container>
                <ng-template #showLoginRegister>
                    <button pButton pRipple label="Login" routerLink="/auth/login" [rounded]="true" [text]="true"></button>
                    <button pButton pRipple label="Register" routerLink="/auth/register" [rounded]="true"></button>
                </ng-template>
            </div>
        </div> `
})
export class TopbarWidget {

    authUser:any

    constructor(
        public router: Router,
        private authService: AuthService
    ) {
          authService.getAuthUser().pipe(map((user) => user)).subscribe((user)=> this.authUser = user);
          console.log(this.authUser)
    }

    isAuth() {
        return this.authService.isAuthenticated();
    }
    logout(): void {
        this.authService.logout(); 
        this.router.navigate(['/']); 
    }
}
