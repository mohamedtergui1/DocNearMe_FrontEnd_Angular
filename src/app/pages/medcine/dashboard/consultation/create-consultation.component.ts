import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';

import { Appointment } from '../../../../model/Appointment';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Consultation } from '../../../../model/Consultation';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MedicationService } from '../../../../core/services/medication.service';
import { SelectItem } from 'primeng/select';
import { Unit } from '../../../../model/Unit';
import { Dropdown, DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-consultation',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputNumberModule,
    TextareaModule,
    InputTextModule,
    CheckboxModule,
    EditorModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule
  ],
  templateUrl: './create-consultation.component.html',
  
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
    .dosage-schedule {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
  `]
})

export class CreateConsultationComponent implements OnInit {
  appointment: Appointment | null = null;
  consultationForm: FormGroup;
  filteredMedications: { id: string, name: string }[] = [];
  unitOptions!: any[];
  appointmentId!: string ;
  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private consultationService: ConsultationService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private medicationService: MedicationService,
    private router:Router
  ) {
    this.consultationForm = this.fb.group({
      reason: ['', Validators.required],
      recoveryDays: [null, [Validators.required, Validators.min(0)]],
      medicationsDosageSchedule: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    this.appointmentId = appointmentId as string;
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
    this.unitOptions = Object.keys(Unit).map(key => ({
      label: key,
      value: Unit[key as keyof typeof Unit]
    }));
  }

  get dosageSchedules(): FormArray {
    return this.consultationForm.get('medicationsDosageSchedule') as FormArray;
  }

  addDosageSchedule(): void {
    this.dosageSchedules.push(this.createDosageFormGroup());
  }

  removeDosageSchedule(index: number): void {
    this.dosageSchedules.removeAt(index);
  }

  private createDosageFormGroup(): FormGroup {
    return this.fb.group({
      numberOfConsumptionInDay: [null, [Validators.required, Validators.min(1)]],
      medicationId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
      unit: [null, Validators.required],
      withFood: [false],
      specialInstructions: [''],
      dateWhenMustStopConsumption: [null, Validators.required],
    });
  }

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
      medicationsDosageSchedule: this.consultationForm.value.medicationsDosageSchedule.map(
        (dosage: any) => ({
          ...dosage,
          medicationId: dosage.medicationId.id,
          dateWhenMustStopConsumption: dosage.dateWhenMustStopConsumption
        })
      ),
    };
    console.log(consultationDTO);

    this.consultationService.createConsultation(consultationDTO,this.appointmentId).subscribe({
      next: (res: any) => {
        this.router.navigate(['/medcine/dashboard']);
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

  searchMedications(event: any): void {
    const query = event.query;
    this.medicationService.searchMedications(query).subscribe({
      next: (res: any) => {
        this.filteredMedications = res.data.map((medication: any) => ({
          id: medication.medicationId,
          name: medication.medicationNameField
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch medications:', err);
      },
    });
  }
}