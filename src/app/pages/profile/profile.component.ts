import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { AuthService } from '../../core/services/auth.service';
import { FluidModule } from 'primeng/fluid';
import { User } from '../../model/User';
import { UserRole } from '../../model/UserRole';
import { CardModule } from 'primeng/card'; // Add CardModule for better layout
import { MessageService } from 'primeng/api'; // For toast messages
import { ToastModule } from 'primeng/toast'; // For toast messages

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CalendarModule,
        FileUploadModule,
        FluidModule,
        CardModule, // Add CardModule
        ToastModule, // Add ToastModule
    ],
    template: `
        <p-toast></p-toast> <!-- Toast component for messages -->
        <div class="profile-container">
            <p-card header="User Profile">
                <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                    <div class="p-fluid">
                        <div class="p-field">
                            <label for="name">Name</label>
                            <input id="name" type="text" pInputText formControlName="name" />
                        </div>
                        <div class="p-field">
                            <label for="email">Email</label>
                            <input id="email" type="email" pInputText formControlName="email" />
                        </div>
                        <div class="p-field">
                            <label for="phoneNumber">Phone Number</label>
                            <input id="phoneNumber" type="text" pInputText formControlName="phoneNumber" />
                        </div>
                        <div class="p-field">
                            <label for="role">Role</label>
                            <p-dropdown
                                id="role"
                                [options]="roles"
                                formControlName="role"
                                placeholder="Select Role"
                            ></p-dropdown>
                        </div>
                        <div class="p-field">
                            <button type="submit" pButton label="Save" [disabled]="profileForm.invalid"></button>
                        </div>
                    </div>
                </form>
            </p-card>
        </div>
    `,
    styles: [
        `
            .profile-container {
                max-width: 600px;
                margin: 2rem auto;
                padding: 1rem;
            }
            .p-field {
                margin-bottom: 1rem;
            }
            label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: bold;
            }
            input, p-dropdown {
                width: 100%;
            }
            button {
                margin-top: 1rem;
            }
        `,
    ],
    providers: [MessageService], // Provide MessageService for toast messages
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup; // Form group for user profile
    user: User | null = null; // Store the authenticated user's data
    roles = [
        { label: 'Medicine', value: UserRole.MEDICINE },
        { label: 'Patient', value: UserRole.PATIENT },
    ]; // Roles for the dropdown

    constructor(
        private authService: AuthService,
        private fb: FormBuilder, // FormBuilder for creating the form
        private messageService: MessageService // For toast messages
    ) {
        // Initialize the form
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.required],
            role: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        // Fetch the authenticated user's data
        this.authService.getAuthUser().subscribe((user) => {
            if (user) {
                this.user = user as User;
                this.populateForm(user as User);
            }
        });
    }

    /**
     * Populates the form with the user's data.
     * @param user - The authenticated user's data.
     */
    populateForm(user: User): void {
        this.profileForm.patchValue({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        });
    }

    /**
     * Handles form submission.
     */
    onSubmit(): void {
        if (this.profileForm.valid && this.user) {
            const updatedUser: User = {
                ...this.user,
                ...this.profileForm.value,
            };

            // Call the AuthService to update the user's profile
            this.authService.updateProfile(this.user.id as string, updatedUser).subscribe({
                next: (response) => {
                    console.log('Profile updated successfully', response);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Profile updated successfully',
                    });
                    // Optionally, update the local user data
                    this.user = response;
                    this.populateForm(response);
                },
                error: (error) => {
                    console.error('Failed to update profile', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update profile',
                    });
                },
            });
        }
    }
}