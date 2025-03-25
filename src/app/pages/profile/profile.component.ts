import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../model/User';
import { LogoComponent } from '../../shared/componenets/logo/logo.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
    PasswordModule,
    ToggleButtonModule,
    LogoComponent,
    FormsModule,
    DividerModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  showPasswordForm = false;
  passwordForm: FormGroup;
  profileForm: FormGroup;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getAuthUser().subscribe(user => {
      this.user = user as User;
      this.profileForm.patchValue({
        name: user?.name,
        email: user?.email,
        phoneNumber: user?.phoneNumber
      });
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  onPasswordChange(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.messageService.add({ severity: 'success', summary: 'Password Updated', detail: 'Password updated successfully' });
    }
  }

  onProfileUpdate(): void {
    if (this.profileForm.valid && this.user) {
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Profile updated successfully' });
    }
  }
}