import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';

// Components
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LogoComponent } from '../../shared/componenets/logo/logo.component';

// Services
import { AuthService, RegisterRequest } from '../../core/services/auth.service';
import { UserRole } from '../../model/UserRole';
import { LayoutComponent } from '../../shared/componenets/layout/layout.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, DropdownModule, InputMaskModule, RouterModule, FileUploadModule, LogoComponent, AvatarModule, LayoutComponent, MessageModule],
    template: `
        <app-layout>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden" selector>
        <div class="flex flex-col items-center justify-center w-full max-w-[800px] p-4">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="flex items-center justify-center pb-12">
                            <app-logo />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create Your Account</div>
                        <span class="text-muted-color font-medium">Sign up to get started</span>
                    </div>

                    <!-- Global Error Message -->
                    <div *ngIf="backendError" class="mb-4">
                        <p-message severity="error" [text]="backendError"></p-message>
                    </div>

                    <form [formGroup]="registrationForm" (ngSubmit)="onRegister()" class="space-y-6">
                        <!-- Name -->
                        <div style="width:777px" class="w-64">
                            <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
                            <input pInputText id="name" formControlName="name" placeholder="Enter your name" class="w-full mb-2" />
                            <small *ngIf="registrationForm.get('name')?.invalid && registrationForm.get('name')?.touched" class="p-error block mt-1">
                                <span *ngIf="registrationForm.get('name')?.errors?.['required']">Name is required</span>
                                <span *ngIf="registrationForm.get('name')?.errors?.['minlength']">Name must be at least 8 characters</span>
                            </small>
                        </div>
                         

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email" type="email" formControlName="email" placeholder="Enter email address" class="w-full mb-2" />
                            <small *ngIf="registrationForm.get('email')?.invalid && registrationForm.get('email')?.touched" class="p-error block mt-1">
                                <span *ngIf="registrationForm.get('email')?.errors?.['required']">Email is required</span>
                                <span *ngIf="registrationForm.get('email')?.errors?.['email']">Invalid email format</span>
                            </small>
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="password" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Password</label>
                            <p-password id="password" formControlName="password" placeholder="Create password" [toggleMask]="true" styleClass="w-full mb-2" [fluid]="true"></p-password>
                            <small *ngIf="registrationForm.get('password')?.invalid && registrationForm.get('password')?.touched" class="p-error block mt-1">
                                <span *ngIf="registrationForm.get('password')?.errors?.['required']">Password is required</span>
                                <span *ngIf="registrationForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters</span>
                            </small>
                        </div>

                        <!-- Phone Number -->
                        <div>
                            <label for="phoneNumber" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone Number</label>
                            <p-inputMask id="phoneNumber" [style]="{width:'777px'}"  mask="+(212)999999999" formControlName="phoneNumber" placeholder="+(212)626183350" class="w-full mb-2"></p-inputMask>
                            <small *ngIf="registrationForm.get('phoneNumber')?.invalid && registrationForm.get('phoneNumber')?.touched" class="p-error block mt-1">Phone number is required</small>
                        </div>

                        <!-- Role -->
                        <div>
                            <label for="role" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Account Type</label>
                            <p-dropdown [options]="roles" formControlName="role" optionLabel="label" optionValue="value" placeholder="Select account type" class="w-full mb-2"></p-dropdown>
                        </div>

                        <!-- Terms and Conditions -->
                        <div class="flex items-center mt-4 mb-8">
                            <p-checkbox formControlName="termsAccepted" [binary]="true" class="mr-2"></p-checkbox>
                            <label>I agree to the Terms and Conditions</label>
                            <small *ngIf="registrationForm.get('termsAccepted')?.invalid && registrationForm.get('termsAccepted')?.touched" class="p-error block mt-1 ml-2">You must accept the terms and conditions</small>
                        </div>

                        <!-- Submit Button with Loading Spinner -->
                        <p-button 
                            label="Create Account" 
                            type="submit" 
                            styleClass="w-full mt-5" 
                            [loading]="isLoading" 
                            [disabled]="!registrationForm.valid || isLoading">
                        </p-button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</app-layout>
    `
})
export class Register implements OnInit {
    registrationForm!: FormGroup;
    backendError: string | null = null;
    isLoading: boolean = false;

    roles = Object.keys(UserRole).map((key) => ({
        label: key,
        value: UserRole[key as keyof typeof UserRole]
    }));

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.registrationForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
            phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
            role: ['PATIENT', Validators.required],
            photoProfil: [''],
            termsAccepted: [false, Validators.requiredTrue]
        });
    }

    onImageSelect(event: any) {
        const file = event.files[0];
        if (file) {
            this.convertToBase64(file)
                .then((base64) => {
                    this.registrationForm.patchValue({ photoProfil: base64 });
                })
                .catch((error) => {
                    console.error('Error converting image:', error);
                    this.registrationForm.patchValue({ photoProfil: '' });
                });
        }
    }

    private convertToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    onRegister() {
        if (this.registrationForm.valid) {
            this.isLoading = true;
            
            const formValue = this.registrationForm.value;

            const registrationData: RegisterRequest = {
                email: formValue.email,
                password: formValue.password,
                name: formValue.name,
                phoneNumber: formValue.phoneNumber,
                role: formValue.role
            };

            this.authService.register(registrationData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/auth/login']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.backendError = error.error.message || 'Registration failed. Please try again.';
                }
            });
        }
    }
}