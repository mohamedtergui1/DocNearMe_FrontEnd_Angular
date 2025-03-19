import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorModule } from 'primeng/editor'; 
import { MessageService } from 'primeng/api';

import { Appointment } from '../../../../model/Appointment';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Consultation } from '../../../../model/Consultation';

@Component({
  selector: 'app-create-consultation',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputNumberModule,
    EditorModule, 
  ],
  template: `
    <p-card header="Create Consultation">
      <div *ngIf="appointment; else loading">
        <p><strong>Subject:</strong> {{ appointment.subject }}</p>
        <p><strong>Start Time:</strong> {{ appointment.startDateTime | date:'shortTime' }}</p>
        <p><strong>End Time:</strong> {{ appointment.endDateTime | date:'shortTime' }}</p>
        <p><strong>Patient ID:</strong> {{ appointment.patientId }}</p>
        <p><strong>Clinic ID:</strong> {{ appointment.clinicId }}</p>
        <p><strong>Status:</strong> {{ appointment.status }}</p>

        <!-- Consultation Form -->
        <form [formGroup]="consultationForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="reason">Reason for Consultation</label>
            <p-editor
              id="reason"
              formControlName="reason"
              [style]="{ height: '150px' }"
              placeholder="Enter the reason for consultation"
            ></p-editor>
          </div>

          <div class="field">
            <label for="recoveryDays">Recovery Days</label>
            <p-inputNumber
              id="recoveryDays"
              formControlName="recoveryDays"
              mode="decimal"
              placeholder="Enter recovery days"
            ></p-inputNumber>
          </div>

          <div class="field">
            <p-button
              type="submit"
              label="Save Consultation"
              icon="pi pi-save"
              styleClass="p-button-success"
              [disabled]="consultationForm.invalid"
            ></p-button>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <ng-template #loading>
        <p>Loading appointment details...</p>
      </ng-template>
    </p-card>
  `,
  styles: [`
    p {
      margin: 0.5rem 0;
    }
    .field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
  `],
})
export class CreateConsultationComponent implements OnInit {
  appointment: Appointment | null = null;
  consultationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private consultationService: ConsultationService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // Initialize the form
    this.consultationForm = this.fb.group({
      reason: ['', Validators.required],
      recoveryDays: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    if (appointmentId) {
      this.appointmentService.getAppointmentById(appointmentId).subscribe({
        next: (res: any) => {
          this.appointment = res.data;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Appointment not found',
            });
          }
        },
      });
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (this.consultationForm.invalid || !this.appointment) {
      return;
    }

    const consultationDTO: Consultation = {
      id: '',
      clinicId: this.appointment.clinicId,
      medicalRecordId: this.appointment.patientId,
      consultationDate: new Date(),
      reason: this.consultationForm.value.reason,
      recoveryDays: this.consultationForm.value.recoveryDays,
      watermarkPath: '',
      medicationsDosageSchedule: [],
    };

    // Call the service to create the consultation
    this.consultationService.createConsultation(consultationDTO).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Consultation created successfully',
        });
        this.consultationForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create consultation',
        });
        console.error('Failed to create consultation:', err);
      },
    });
  }
}