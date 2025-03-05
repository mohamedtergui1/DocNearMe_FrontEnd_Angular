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

// Components
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LogoComponent } from '../../shared/componenets/logo/logo.component';

// Services
import { AuthService, RegisterRequest } from '../service/auth.service';
import { UserRole } from '../../model/UserRole';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        DropdownModule,
        InputMaskModule,
        RouterModule,
        FileUploadModule,
        AppFloatingConfigurator,
        LogoComponent,
        AvatarModule
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center w-full max-w-[800px] p-4">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <app-logo />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create Your Account</div>
                            <span class="text-muted-color font-medium">Sign up to get started</span>
                        </div>

                        <form [formGroup]="registrationForm" (ngSubmit)="onRegister()">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                

                                <!-- Name -->
                                <div>
                                    <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
                                    <input pInputText id="name" formControlName="name" placeholder="Enter your name" class="w-full mb-4" />
                                    <small *ngIf="registrationForm.get('name')?.invalid && registrationForm.get('name')?.touched" class="p-error">
                                        <span *ngIf="registrationForm.get('name')?.errors?.['required']">Name is required</span>
                                        <span *ngIf="registrationForm.get('name')?.errors?.['minlength']">Name must be at least 8 characters</span>
                                    </small>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                    <input pInputText id="email" type="email" formControlName="email" placeholder="Enter email address" class="w-full mb-4" />
                                    <small *ngIf="registrationForm.get('email')?.invalid && registrationForm.get('email')?.touched" class="p-error">
                                        <span *ngIf="registrationForm.get('email')?.errors?.['required']">Email is required</span>
                                        <span *ngIf="registrationForm.get('email')?.errors?.['email']">Invalid email format</span>
                                    </small>
                                </div>

                                <!-- Password -->
                                <div>
                                    <label for="password" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Password</label>
                                    <p-password id="password" formControlName="password" placeholder="Create password" [toggleMask]="true" styleClass="w-full mb-4" [fluid]="true"></p-password>
                                    <small *ngIf="registrationForm.get('password')?.invalid && registrationForm.get('password')?.touched" class="p-error">
                                        <span *ngIf="registrationForm.get('password')?.errors?.['required']">Password is required</span>
                                        <span *ngIf="registrationForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters</span>
                                    </small>
                                </div>

                                <!-- Phone Number -->
                                <div>
                                    <label for="phoneNumber" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone Number</label>
                                    <p-inputMask id="phoneNumber" mask="(999) 999-9999" formControlName="phoneNumber" placeholder="(612) 345-6789" class="w-full mb-4"></p-inputMask>
                                    <small *ngIf="registrationForm.get('phoneNumber')?.invalid && registrationForm.get('phoneNumber')?.touched" class="p-error"> Phone number is required </small>
                                </div>

                                <!-- Role -->
                                <div>
                                    <label for="role" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Account Type</label>
                                    <p-dropdown [options]="roles" formControlName="role" optionLabel="label" optionValue="value" placeholder="Select account type" class="w-full mb-4"></p-dropdown>
                                </div>
                            </div>

                            <!-- Terms and Conditions -->
                            <div class="flex items-center mt-4 mb-8">
                                <p-checkbox formControlName="termsAccepted" [binary]="true" class="mr-2"></p-checkbox>
                                <label>I agree to the Terms and Conditions</label>
                            </div>

                            <!-- Submit Button -->
                            <p-button label="Create Account" type="submit" styleClass="w-full" [disabled]="!registrationForm.valid"></p-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register implements OnInit {
    registrationForm!: FormGroup;

    roles = Object.keys(UserRole).map(key => ({
        label: key,
        value: UserRole[key as keyof typeof UserRole]
    }));

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {}

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
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    console.error('Registration failed', error);
                }
            });
        }
    }
}