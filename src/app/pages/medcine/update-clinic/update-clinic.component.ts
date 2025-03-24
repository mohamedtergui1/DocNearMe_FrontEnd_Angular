import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClinicService } from '../../../core/services/clinic.service';
import { Category } from '../../../model/Category';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/componenets/layout/layout.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DayOfWeek } from '../../../model/DayOfWeek';
import { CategoryService } from '../../../core/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LogoComponent } from '../../../shared/componenets/logo/logo.component';
import { VacationPeriod } from '../../../model/VacationPeriod';

@Component({
  selector: 'app-update-clinic',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    MultiSelectModule,
    CalendarModule,
    ReactiveFormsModule,
    LogoComponent
  ],
  template: `
    <div class=" flex justify-center " >
         
            <div class="flex flex-col items-center justify-center w-full max-w-[800px] p-4">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="flex items-center justify-center pb-8">
                                <app-logo />
                            </div>
                            <div class="text-primary-500 dark:text-primary-400 text-3xl font-bold mb-2">Update Your Clinic</div>
                            <span class="text-600 dark:text-400 font-medium">Edit your healthcare facility</span>
                        </div>

                        <form [formGroup]="clinicForm" (ngSubmit)="onSubmit()" class="space-y-5">
                            <!-- Clinic Name -->
                            <div class="field">
                                <label class="text-primary-500 dark:text-primary-400" for="clinicName" class="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                                <input pInputText id="clinicName" formControlName="clinicName" class="w-full"
                                    [ngClass]="{'p-invalid': clinicForm.get('clinicName')?.invalid && clinicForm.get('clinicName')?.touched}" />
                                <small *ngIf="clinicForm.get('clinicName')?.invalid && clinicForm.get('clinicName')?.touched" class="p-error block mt-1">
                                    Clinic name is required
                                </small>
                            </div>

                            <!-- Clinic Address -->
                            <div class="field">
                                <label class="text-primary-500 dark:text-primary-400" for="clinicAddress" class="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
                                <input pInputText id="clinicAddress" formControlName="clinicAddress" class="w-full"
                                    [ngClass]="{'p-invalid': clinicForm.get('clinicAddress')?.invalid && clinicForm.get('clinicAddress')?.touched}" />
                                <small *ngIf="clinicForm.get('clinicAddress')?.invalid && clinicForm.get('clinicAddress')?.touched" class="p-error block mt-1">
                                    Clinic address is required
                                </small>
                            </div>

                            <!-- Category -->
                            <div class="field">
                                <label class="text-primary-500 dark:text-primary-400" for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <p-dropdown id="categoryId" formControlName="categoryId" [style]="{width:'777px'}" [options]="categories" 
                                    optionLabel="name" optionValue="id" class="w-full"
                                    [ngClass]="{'p-invalid': clinicForm.get('categoryId')?.invalid && clinicForm.get('categoryId')?.touched}">
                                </p-dropdown>
                                <small *ngIf="clinicForm.get('categoryId')?.invalid && clinicForm.get('categoryId')?.touched" class="p-error block mt-1">
                                    Please select a category
                                </small>
                            </div>

                            <!-- Working Hours -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="field">
                                    <label class="text-primary-500 dark:text-primary-400" for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <p-calendar id="startTime" formControlName="startTime" [timeOnly]="true" 
                                        hourFormat="24" class="w-full"
                                        [ngClass]="{'p-invalid': clinicForm.get('startTime')?.invalid && clinicForm.get('startTime')?.touched}">
                                    </p-calendar>
                                </div>
                                <div class="field">
                                    <label class="text-primary-500 dark:text-primary-400" for="stopTime" class="block text-sm font-medium text-gray-700 mb-1">Stop Time</label>
                                    <p-calendar id="stopTime" formControlName="stopTime" [timeOnly]="true" 
                                        hourFormat="24" class="w-full"
                                        [ngClass]="{'p-invalid': (clinicForm.get('stopTime')?.invalid && clinicForm.get('stopTime')?.touched)}">
                                    </p-calendar>
                                </div>
                                <small *ngIf="clinicForm.get('startTime')?.invalid && clinicForm.get('startTime')?.touched" class="p-error col-span-2">
                                    Start time is required
                                </small>
                                <small *ngIf="clinicForm.get('stopTime')?.invalid && clinicForm.get('stopTime')?.touched" class="p-error col-span-2">
                                    Stop time is required
                                </small>
                                <small *ngIf="clinicForm.get('stopTime')?.errors?.['timeOrder']" class="p-error col-span-2">
                                    Stop time must be after start time
                                </small>
                            </div>

                            <!-- Working Days -->
                            <div class="field">
                                <label class="text-primary-500 dark:text-primary-400" for="workingDays" class="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                                <p-multiSelect id="workingDays" formControlName="workingDays" [options]="daysOfWeek"
                                    optionLabel="label" optionValue="value" class="w-full"
                                    [ngClass]="{'p-invalid': clinicForm.get('workingDays')?.invalid && clinicForm.get('workingDays')?.touched}">
                                </p-multiSelect>
                                <small *ngIf="clinicForm.get('workingDays')?.invalid && clinicForm.get('workingDays')?.touched" class="p-error block mt-1">
                                    Please select at least one working day
                                </small>
                            </div>

                            <!-- Vacation Periods -->
                            <div>
                                <label class="text-primary-500 dark:text-primary-400" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Vacation Periods</label>
                                <div formArrayName="vacations" class="space-y-4">
                                    <div *ngFor="let vacation of vacations.controls; let i = index" [formGroupName]="i" class="grid grid-cols-2 gap-4">
                                        <div class="field">
                                            <label class="text-primary-500 dark:text-primary-400" for="startDate-{{ i }}" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <p-calendar 
                                                id="startDate-{{ i }}" 
                                                formControlName="startDate" 
                                                [showTime]="false" 
                                                class="w-full"
                                                [ngClass]="{'p-invalid': vacation.get('startDate')?.invalid && vacation.get('startDate')?.touched}">
                                            </p-calendar>
                                            <small *ngIf="vacation.get('startDate')?.invalid && vacation.get('startDate')?.touched" class="p-error block mt-1">
                                                Start date is required
                                            </small>
                                        </div>
                                        <div class="field">
                                            <label class="text-primary-500 dark:text-primary-400" for="endDate-{{ i }}" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <p-calendar 
                                                id="endDate-{{ i }}" 
                                                formControlName="endDate" 
                                                [showTime]="false" 
                                                class="w-full"
                                                [ngClass]="{'p-invalid': vacation.get('endDate')?.invalid && vacation.get('endDate')?.touched}">
                                            </p-calendar>
                                            <small *ngIf="vacation.get('endDate')?.invalid && vacation.get('endDate')?.touched" class="p-error block mt-1">
                                                End date is required
                                            </small>
                                        </div>
                                        <small *ngIf="vacation.errors?.['dateOrder']" class="p-error block mt-1 col-span-2">
                                            End date must be after start date
                                        </small>
                                        <div class="col-span-2 flex justify-end">
                                            <button 
                                                type="button" 
                                                pButton 
                                                icon="pi pi-trash" 
                                                class="p-button-danger p-button-sm" 
                                                (click)="removeVacation(i)">
                                            </button>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        pButton 
                                        icon="pi pi-plus" 
                                        label="Add Vacation Period" 
                                        class="p-button-secondary" 
                                        (click)="addVacation()">
                                    </button>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex justify-center mt-6">
                                <button type="submit" pButton label="Update Clinic" class="w-full" 
                                    [disabled]="clinicForm.invalid"></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
 
  `,
  styles: [
    `
    .p-error {
        color: #ff0000;
        font-size: 0.875rem;
    }
    `
  ]
})
export class UpdateClinicComponent implements OnInit {
  clinicForm: FormGroup;
  categories: Category[] = [];
  daysOfWeek: { label: string; value: DayOfWeek }[] = [];
  clinicId!: string;

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.clinicForm = this.fb.group({
      clinicName: ['', Validators.required],
      clinicAddress: ['', Validators.required],
      categoryId: [null, Validators.required],
      startTime: [null, [Validators.required]],
      stopTime: [null, [Validators.required, this.timeValidator.bind(this)]],
      workingDays: [[], Validators.required],
      vacations: this.fb.array([])
    });

   
 

  }

  ngOnInit(): void {
    this.daysOfWeek = Object.values(DayOfWeek).map((day) => ({
      label: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(),
      value: day
    }));

    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data?.data;
      }
    });

    this.loadClinicData();

    // Add cross-field validators
    this.clinicForm.get('startTime')?.valueChanges.subscribe(() => {
      this.clinicForm.get('stopTime')?.updateValueAndValidity();
    });
    this.clinicForm.get('stopTime')?.valueChanges.subscribe(() => {
      this.clinicForm.get('startTime')?.updateValueAndValidity();
    });
  }

  private loadClinicData(): void {
    this.clinicService.getClinicForAuthUser().subscribe({
      next: (response:any) => {
        const clinic = response?.data;
        this.clinicId = clinic.id;
        const startTime = this.convertTimeStringToDate(clinic.startTime);
        const stopTime = this.convertTimeStringToDate(clinic.stopTime);

        // Clear existing vacations
        while (this.vacations.length) {
          this.vacations.removeAt(0);
        }

        // Add vacation periods
        if (clinic.vacations && clinic.vacations.length > 0) {
          clinic.vacations.forEach((vacation:VacationPeriod) => {
            this.addVacation();
            const lastIndex = this.vacations.length - 1;
            this.vacations.at(lastIndex).patchValue({
              startDate: new Date(vacation.startDate),
              endDate: new Date(vacation.endDate)
            });
          });
        }
        console.log(this.categories.find((category) => category.name === clinic.categoryName))
        // Patch the form values
        this.clinicForm.patchValue({
          clinicName: clinic.clinicName,
          clinicAddress: clinic.clinicAddress,
          categoryId: this.categories.find((category) => category.name === clinic.categoryName)?.id,
          startTime: startTime,
          stopTime: stopTime,
          workingDays: clinic.workingDays
        });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load clinic data' });
        this.router.navigate(['/medcine/dashboard']);
      }
    });
  }

  private convertTimeStringToDate(timeString: string): Date {
    if (!timeString) return new Date();
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date;
  }

  private timeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = this.clinicForm?.get('startTime')?.value;
    const stopTime = control.value;

    if (startTime && stopTime) {
      const start = new Date(startTime).getTime();
      const stop = new Date(stopTime).getTime();
      if (start >= stop) {
        return { timeOrder: true };
      }
    }
    return null;
  }

  private dateValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (start >= end) {
        return { dateOrder: true };
      }
    }
    return null;
  }

  get vacations(): FormArray {
    return this.clinicForm.get('vacations') as FormArray;
  }

  addVacation(): void {
    const vacationGroup = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    }, { validators: this.dateValidator.bind(this) });

    this.vacations.push(vacationGroup);
  }

  removeVacation(index: number): void {
    this.vacations.removeAt(index);
  }

  onSubmit(): void {
    if (this.clinicForm.valid) {
      const clinicRequest = this.clinicForm.value;

      clinicRequest.startTime = this.extractTime(clinicRequest.startTime);
      clinicRequest.stopTime = this.extractTime(clinicRequest.stopTime);

      clinicRequest.vacations = clinicRequest.vacations.map((vacation: any) => ({
        startDate: this.extractDate(vacation.startDate),
        endDate: this.extractDate(vacation.endDate)
      }));

      this.clinicService.updateClinic(this.clinicId, clinicRequest).subscribe(
        (response) => {
          
          this.router.navigate(['/medcine/dashboard']);
        },
        (error) => {
          
        }
      );
    }
  }

  private extractTime(time: any): string {
    if (!time) return '';
    const timeString = time instanceof Date ? time.toISOString() : String(time);
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    return timeString;
  }

  private extractDate(date: any): string {
    if (!date) return '';
    const dateString = date instanceof Date ? date.toISOString() : String(date);
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    return dateString;
  }
}