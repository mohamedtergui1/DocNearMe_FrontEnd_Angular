import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { User } from '../../model/User';
import { UserRole } from '../../model/UserRole';
import { AuthService } from '../../core/services/auth.service';
import { FluidModule } from 'primeng/fluid';
import { Avatar } from 'primeng/avatar';
import { InputMask } from 'primeng/inputmask';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, DropdownModule, CalendarModule, FileUploadModule, FluidModule, InputMask],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    userForm!: FormGroup;
    userRoles = [
        { label: 'MEDICINE', value: UserRole.MEDICINE },
        { label: 'PATIENT', value: UserRole.PATIENT }
    ];
    maxBirthDate = new Date();
    user?: User;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.maxBirthDate.setFullYear(this.maxBirthDate.getFullYear() - 16);
    }

    ngOnInit() {
        this.initForm();
        this.loadUserData();
    }

    cancelEdit() {
        this.isEditMode = false;
    }

    toggleEditMode() {
        if (this.user) {
            // this.userForm.patchValue({
            //     nom: this.user.nom,
            //     prenom: this.user.prenom,
            //     email: this.user.email,
            //     telephone: this.user.telephone,
            //     dateNaissance: new Date(this.user.dateNaissance),
            //     adresse: {
            //         rue: this.user.adresse.rue,
            //         ville: this.user.adresse.ville,
            //         codePostal: this.user.adresse.codePostal
            //     },
            //     role: this.user.role,
            //     photoProfil: this.user.photoProfil
            // });
        }
        this.isEditMode = true;
    }
    private initForm() {
        this.userForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            prenom: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            telephone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
            dateNaissance: ['', [Validators.required, this.ageValidator]],
            adresse: this.fb.group({
                rue: ['', Validators.required],
                ville: ['', Validators.required],
                codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
            }),
            role: [UserRole.PATIENT, Validators.required],
            photoProfil: ['']
        });
    }

    private loadUserData() {
        const userData = this.route.snapshot.data['data'];
        if (userData) {
            this.user = userData;
            this.userForm.patchValue({
                ...userData,
                dateNaissance: new Date(userData.dateNaissance)
            });
        }
    }

    onImageUpload(event: FileUploadEvent | any) {
        const file = event.files[0];
        if (file) {
            this.convertToBase64(file).then((base64) => {
                this.userForm.patchValue({ photoProfil: base64 });
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

    private ageValidator(control: any) {
        const birthDate = new Date(control.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 16 ? null : { underage: true };
    }

    onSubmit() {
        if (this.userForm.valid && this.user) {
            const updatedUser: User = {
                ...this.user,
                ...this.userForm.value,
                dateNaissance: new Date(this.userForm.value.dateNaissance).toISOString()
            };
            this.authService.updateProfile(this.user.id as string, updatedUser).subscribe({
                next: (response) => {
                    this.user = response;
                    this.isEditMode = false;

                },
                error: (error) => {
                    console.error('Error updating profile:', error);
                }
            });
        }
    }
}
