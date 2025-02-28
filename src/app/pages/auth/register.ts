import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { GenerateUUID } from '../../shared/services/generateUUID';

// Components
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LogoComponent } from '../../shared/logo/logo.component';

// Services
import { AuthService } from '../service/auth.service';
import { User as UserType  } from '../../model/User';
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
        CalendarModule,
        InputMaskModule,
        RippleModule,
        RouterModule,
        FileUploadModule,
        AppFloatingConfigurator,
        LogoComponent,
        AvatarModule,
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
                                <!-- Profile Photo Upload -->
                                <div class="col-span-2">
                                    <div class="flex flex-col items-center mb-4">
                                        <p-avatar [image]="registrationForm.get('photoProfil')?.value" size="xlarge" shape="circle" class="mb-4 h-56"></p-avatar>
                                        <p-fileUpload mode="basic" chooseLabel="Choose Image" accept="image/*" maxFileSize="1000000" (onSelect)="onImageSelect($event)" class="w-full"></p-fileUpload>
                                    </div>

                                    <small *ngIf="registrationForm.get('photoProfil')?.errors?.['invalidSize']" class="p-error"> Image must be less than 1MB </small>
                                </div>

                                <!-- Last Name -->
                                <div>
                                    <label for="nom" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Last Name</label>
                                    <input pInputText id="nom" formControlName="nom" placeholder="Enter last name" class="w-full mb-4" />
                                    <small *ngIf="registrationForm.get('nom')?.invalid && registrationForm.get('nom')?.touched" class="p-error"> Last name is required </small>
                                </div>

                                <!-- First Name -->
                                <div>
                                    <label for="prenom" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">First Name</label>
                                    <input pInputText id="prenom" formControlName="prenom" placeholder="Enter first name" class="w-full mb-4" />
                                    <small *ngIf="registrationForm.get('prenom')?.invalid && registrationForm.get('prenom')?.touched" class="p-error"> First name is required </small>
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
                                        <span *ngIf="registrationForm.get('password')?.errors?.['passwordStrength']">Must contain uppercase, lowercase, number, and special character</span>
                                    </small>
                                </div>

                                <!-- Phone Number -->
                                <div>
                                    <label for="telephone" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone Number</label>
                                    <p-inputMask id="telephone" mask="(999) 999-9999" formControlName="telephone" placeholder="(612) 345-6789" class="w-full mb-4"></p-inputMask>
                                    <small *ngIf="registrationForm.get('telephone')?.invalid && registrationForm.get('telephone')?.touched" class="p-error"> Phone number is required </small>
                                </div>

                                <!-- Date of Birth -->
                                <div>
                                    <label for="dateNaissance" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Date of Birth</label>
                                    <p-calendar id="dateNaissance" [showIcon]="true" [maxDate]="maxBirthDate" dateFormat="yy-mm-dd" formControlName="dateNaissance" placeholder="Select birth date" class="w-full mb-4"></p-calendar>
                                    <small *ngIf="registrationForm.get('dateNaissance')?.invalid && registrationForm.get('dateNaissance')?.touched" class="p-error">
                                        <span *ngIf="registrationForm.get('dateNaissance')?.errors?.['required']">Date of birth is required</span>
                                        <span *ngIf="registrationForm.get('dateNaissance')?.errors?.['underage']">Must be at least 16 years old</span>
                                    </small>
                                </div>

                                <!-- Address Street -->
                                <div>
                                    <label for="rue" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Street Address</label>
                                    <input pInputText id="rue" formControlName="rue" placeholder="Enter street address" class="w-full mb-4" />
                                    <small *ngIf="registrationForm.get('rue')?.invalid && registrationForm.get('rue')?.touched" class="p-error"> Street address is required </small>
                                </div>

                                <!-- City -->
                                <div>
                                    <label for="ville" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">City</label>
                                    <input pInputText id="ville" formControlName="ville" placeholder="Enter city" class="w-full mb-4" />
                                    <small *ngIf="registrationForm.get('ville')?.invalid && registrationForm.get('ville')?.touched" class="p-error"> City is required </small>
                                </div>

                                <!-- Postal Code -->
                                <div>
                                    <label for="codePostal" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Postal Code</label>
                                    <p-inputMask id="codePostal" mask="99999" formControlName="codePostal" placeholder="20000" class="w-full mb-4"></p-inputMask>
                                    <small *ngIf="registrationForm.get('codePostal')?.invalid && registrationForm.get('codePostal')?.touched" class="p-error"> Postal code is required </small>
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
    readonly defaultImage:string =  ""

    roles = [
        { label: 'Individual', value: 'particulier' },
        { label: 'Business', value: 'entreprise' }
    ];

    maxBirthDate = new Date();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private uuidService: GenerateUUID,
        private router: Router
    ) {
        this.maxBirthDate.setFullYear(this.maxBirthDate.getFullYear() - 16);
    }

    ngOnInit() {
        this.initForm();
    }
    
    initForm() {
        this.registrationForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            prenom: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
            telephone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
            dateNaissance: ['', [Validators.required, this.ageValidator]],
            rue: ['', Validators.required],
            ville: ['', Validators.required],
            codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
            role: ['particulier', Validators.required],
            termsAccepted: [false, Validators.requiredTrue],
            photoProfil: ['', [this.imageSizeValidator]]
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

    imageSizeValidator(control: any) {
        if (control.value) {
            const base64Length = control.value.length;
            const sizeInBytes = 4 * Math.ceil(base64Length / 3) * 0.5624896334383812;
            return sizeInBytes <= 1000000 ? null : { invalidSize: true };
        }
        return null;
    }

    passwordStrengthValidator(control: any) {
        const value = control.value;
        if (!value) return null;

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar ? null : { passwordStrength: true };
    }

    ageValidator(control: any) {
        const birthDate = new Date(control.value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 16 ? null : { underage: true };
    }

    onRegister() {
        if (this.registrationForm.valid) {
            const formValue = this.registrationForm.value;

            const registrationData:UserType = {
                id : this.uuidService.generate() ,
                email: formValue.email,
                password: formValue.password,
                nom: formValue.nom,
                prenom: formValue.prenom,
                adresse: {
                    rue: formValue.rue,
                    ville: formValue.ville,
                    codePostal: formValue.codePostal
                },
                telephone: formValue.telephone,
                dateNaissance: new Date(formValue.dateNaissance).toISOString(),
                role: formValue.role,
                photoProfil: formValue.photoProfil
            };

            this.authService.register(registrationData).subscribe({
                next: (user) => {
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    console.error('Registration failed', error);
                }
            });
        }
    }
}
