import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService, LoginResponse } from '../service/auth.service';
import { User as UserType } from '../../model/User';
import { UserRole } from '../../model/UserRole';
import { LogoComponent } from '../../shared/componenets/logo/logo.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ToastModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, LogoComponent],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast></p-toast>
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <app-logo />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <form (ngSubmit)="onSubmit()" [formGroup]="loginForm">
                            <div class="flex flex-col gap-2">
                                <div>
                                    <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                    <input pInputText id="email1" type="email" placeholder="Email address" class="w-full md:w-[30rem] mb-2" formControlName="email" />
                                    <small *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched" class="p-error block mb-4">Email is required</small>
                                    <small *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched" class="p-error block mb-4">Invalid email format</small>
                                </div>
                                <div>
                                    <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                    <p-password id="password1" formControlName="password" placeholder="Password" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>
                                    <small *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched" class="p-error block mb-4">Password is required</small>
                                </div>
                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <p-checkbox formControlName="rememberMe" id="rememberme1" binary class="mr-2"></p-checkbox>
                                        <label for="rememberme1">Remember me</label>
                                    </div>
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                                </div>
                                <p-button label="Sign In" styleClass="w-full" type="submit" [loading]="loading"></p-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {
    loginForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }

    ngOnInit() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            this.loginForm.patchValue({
                email: rememberedEmail,
                rememberMe: true
            });
        }
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        this.loading = true;
        const { email, password, rememberMe } = this.loginForm.value;

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        this.authService.login(email, password).subscribe({
            next: (res: { data: LoginResponse }) => {
                this.authService.storeAuthData(res.data);
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                console.error('Login Error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: error.message || 'An unexpected error occurred during login.'
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
