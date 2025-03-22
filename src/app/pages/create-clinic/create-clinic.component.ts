import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClinicService } from '../../core/services/clinic.service';
import { Category } from '../../model/Category';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/componenets/layout/layout.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DayOfWeek } from '../../model/DayOfWeek';
import { CategoryService } from '../../core/services/category.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-clinic',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        LayoutComponent,
        MultiSelectModule,
        CalendarModule,
        ReactiveFormsModule
    ],
    template: `
    <app-layout>
  <section class="container mx-auto px-4 py-8" selector >
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-teal-600 py-6 px-8">
        <h1 class="text-2xl font-bold text-white">Create Your Clinic</h1>
        <p class="text-teal-100 mt-1">Register your healthcare facility</p>
      </div>

      <form [formGroup]="clinicForm" (ngSubmit)="onSubmit()" class="p-8 card">
        <div class="space-y-6">
          <!-- Clinic Name -->
          <div class="p-field">
            <label for="clinicName" class="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
            <input
              pInputText
              type="text"
              id="clinicName"
              formControlName="clinicName"
              class="w-full"
              [ngClass]="{ 'p-invalid': clinicForm.get('clinicName')?.invalid && clinicForm.get('clinicName')?.touched }"
            />
            <small *ngIf="clinicForm.get('clinicName')?.invalid && clinicForm.get('clinicName')?.touched" class="p-error">Clinic name is required</small>
          </div>

          <!-- Clinic Address -->
          <div class="p-field">
            <label for="clinicAddress" class="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
            <input
              pInputText
              type="text"
              id="clinicAddress"
              formControlName="clinicAddress"
              class="w-full"
              [ngClass]="{ 'p-invalid': clinicForm.get('clinicAddress')?.invalid && clinicForm.get('clinicAddress')?.touched }"
            />
            <small *ngIf="clinicForm.get('clinicAddress')?.invalid && clinicForm.get('clinicAddress')?.touched" class="p-error">Clinic address is required</small>
          </div>

          <!-- Category -->
          <div class="p-field">
            <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <p-dropdown
              id="categoryId"
              formControlName="categoryId"
              [options]="categories"
              optionLabel="name"
              optionValue="id"
              placeholder="Select a category"
              [ngClass]="{ 'p-invalid': clinicForm.get('categoryId')?.invalid && clinicForm.get('categoryId')?.touched }"
            ></p-dropdown>
            <small *ngIf="clinicForm.get('categoryId')?.invalid && clinicForm.get('categoryId')?.touched" class="p-error">Please select a category</small>
          </div>

          <!-- Working Hours -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-field">
              <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <p-calendar
                id="startTime"
                formControlName="startTime"
                [timeOnly]="true"
                hourFormat="24"
                placeholder="Select start time"
                [ngClass]="{ 'p-invalid': clinicForm.get('startTime')?.invalid && clinicForm.get('startTime')?.touched }"
              ></p-calendar>
              <small *ngIf="clinicForm.get('startTime')?.invalid && clinicForm.get('startTime')?.touched" class="p-error">Start time is required</small>
            </div>
            <div class="p-field">
              <label for="stopTime" class="block text-sm font-medium text-gray-700 mb-1">Stop Time</label>
              <p-calendar
                id="stopTime"
                formControlName="stopTime"
                [timeOnly]="true"
                hourFormat="24"
                placeholder="Select stop time"
                [ngClass]="{ 'p-invalid': clinicForm.get('stopTime')?.invalid && clinicForm.get('stopTime')?.touched }"
              ></p-calendar>
              <small *ngIf="clinicForm.get('stopTime')?.invalid && clinicForm.get('stopTime')?.touched" class="p-error">Stop time is required</small>
            </div>
          </div>

          <!-- Working Days -->
          <div class="p-field">
            <label for="workingDays" class="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
            <p-multiSelect
              id="workingDays"
              styleClass="w-full"
              formControlName="workingDays"
              [options]="daysOfWeek"
              optionLabel="label"
              optionValue="value"
              placeholder="Select working days"
              [ngClass]="{ 'p-invalid': clinicForm.get('workingDays')?.invalid && clinicForm.get('workingDays')?.touched }"
            ></p-multiSelect>
            <small *ngIf="clinicForm.get('workingDays')?.invalid && clinicForm.get('workingDays')?.touched" class="p-error">Please select at least one working day</small>
          </div>

          <!-- Vacation Periods -->
          <div class="p-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">Vacation Periods</label>
            <div formArrayName="vacations" class="space-y-4">
              <div *ngFor="let vacation of vacations.controls; let i = index" [formGroupName]="i" class="grid grid-cols-2 gap-4">
                <div class="p-field">
                  <label for="startDate-{{ i }}" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p-calendar id="startDate-{{ i }}" formControlName="startDate" [showTime]="false" placeholder="Select start date"></p-calendar>
                </div>
                <div class="p-field">
                  <label for="endDate-{{ i }}" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <p-calendar id="endDate-{{ i }}" formControlName="endDate" [showTime]="false" placeholder="Select end date"></p-calendar>
                </div>
                <div class="col-span-2">
                  <button type="button" pButton label="Remove" class="p-button-danger" (click)="removeVacation(i)"></button>
                </div>
              </div>
              <button type="button" pButton label="Add Vacation Period" class="p-button-secondary" (click)="addVacation()"></button>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit" pButton label="Register Clinic" class="p-button-primary" [disabled]="clinicForm.invalid"></button>
          </div>
        </div>
      </form>
    </div>
  </section>
</app-layout>
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
export class CreateClinicComponent implements OnInit {
    clinicForm: FormGroup;
    categories: Category[] = []; // Populate this from your service
    daysOfWeek: { label: string; value: DayOfWeek }[] = []; // Options for multi-select

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
            startTime: [null, Validators.required],
            stopTime: [null, Validators.required],
            workingDays: [[], Validators.required],
            vacations: this.fb.array([]) // Dynamic array for vacation periods
        });
    }

    ngOnInit(): void {
        // Initialize the days of the week for the multi-select dropdown
        this.daysOfWeek = Object.values(DayOfWeek).map((day) => ({
            label: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(), // Format: "Monday", "Tuesday", etc.
            value: day
        }));

        this.categoryService.getCategories().subscribe({
            next: (data: any) => {
                this.categories = data?.data;
                console.log(data.data);
            }
        });
    }

    // Getter for the vacations FormArray
    get vacations(): FormArray {
        return this.clinicForm.get('vacations') as FormArray;
    }

    // Add a new vacation period
    addVacation(): void {
        this.vacations.push(
            this.fb.group({
                startDate: [null, Validators.required],
                endDate: [null, Validators.required]
            })
        );
    }

    // Remove a vacation period
    removeVacation(index: number): void {
        this.vacations.removeAt(index);
    }

    onSubmit(): void {
        if (this.clinicForm.valid) {
            const clinicRequest = this.clinicForm.value;

            // Extract and format time fields
            clinicRequest.startTime = this.extractTime(clinicRequest.startTime);
            clinicRequest.stopTime = this.extractTime(clinicRequest.stopTime);

            // Extract and format date fields in vacations
            clinicRequest.vacations = clinicRequest.vacations.map((vacation: any) => ({
                startDate: this.extractDate(vacation.startDate),
                endDate: this.extractDate(vacation.endDate)
            }));

            console.log(clinicRequest);

            this.clinicService.createClinic(clinicRequest).subscribe(
                  (response) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Clinic created successfully' });
                    this.router.navigate(['/medcine/dashboard']);
                    console.log(response);
                    this.clinicForm.reset();
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create clinic' });
                }
            );
        }
    }

    private extractTime(time: any): string {
        console.log('Input time:', time);
        if (!time) return '';

        // Convert time to a string if it's a Date object
        const timeString = time instanceof Date ? time.toISOString() : String(time);

        // If time is in ISO format, extract the HH:mm:ss part
        if (timeString.includes('T')) {
            const date = new Date(timeString);
            const hours = date.getHours().toString().padStart(2, '0'); // Ensure two digits
            const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits
            const seconds = date.getSeconds().toString().padStart(2, '0'); // Ensure two digits
            return `${hours}:${minutes}:${seconds}`; // Format as HH:mm:ss
        }

        return timeString; // Already in HH:mm:ss format
    }

    // Helper method to extract date in yyyy-MM-dd format
    private extractDate(date: any): string {
        console.log('Input date:', date); // Debugging
        if (!date) return '';

        // Convert date to a string if it's a Date object
        const dateString = date instanceof Date ? date.toISOString() : String(date);

        // If date is in ISO format, extract the yyyy-MM-dd part
        if (dateString.includes('T')) {
            return dateString.split('T')[0]; // Extract the date part (yyyy-MM-dd)
        }

        return dateString; // Already in yyyy-MM-dd format
    }
}