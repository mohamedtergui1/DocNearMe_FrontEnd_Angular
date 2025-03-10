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

@Component({
    selector: 'app-create-clinic',
    standalone: true,
    imports: [CommonModule, InputTextModule, DropdownModule, ButtonModule, LayoutComponent, MultiSelectModule, CalendarModule, ReactiveFormsModule],
    template: `
        <app-layout>
            <div class="container mx-auto px-4 py-8" selector>
                <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="bg-teal-600 py-6 px-8">
                        <h1 class="text-2xl font-bold text-white">Create New Clinic</h1>
                        <p class="text-teal-100 mt-1">Register your healthcare facility</p>
                    </div>

                    <form [formGroup]="clinicForm" (ngSubmit)="onSubmit()" class="p-8">
                        <div class="space-y-6">
                            <!-- Clinic Name -->
                            <div>
                                <label for="clinicName" class="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                                <input
                                    type="text"
                                    id="clinicName"
                                    formControlName="clinicName"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    [ngClass]="{ 'border-red-500': clinicForm.get('clinicName')?.invalid && clinicForm.get('clinicName')?.touched }"
                                />
                                <div *ngIf="clinicForm.get('clinicName')?.invalid && clinicForm.get('clinicName')?.touched" class="text-red-500 text-sm mt-1">Clinic name is required</div>
                            </div>

                            <!-- Clinic Address -->
                            <div>
                                <label for="clinicAddress" class="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
                                <input
                                    type="text"
                                    id="clinicAddress"
                                    formControlName="clinicAddress"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    [ngClass]="{ 'border-red-500': clinicForm.get('clinicAddress')?.invalid && clinicForm.get('clinicAddress')?.touched }"
                                />
                                <div *ngIf="clinicForm.get('clinicAddress')?.invalid && clinicForm.get('clinicAddress')?.touched" class="text-red-500 text-sm mt-1">Clinic address is required</div>
                            </div>

                            <!-- Category -->
                            <div>
                                <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <p-dropdown
                                    id="categoryId"
                                    formControlName="categoryId"
                                    [options]="categories"
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="Select a category"
                                    [ngClass]="{ 'border-red-500': clinicForm.get('categoryId')?.invalid && clinicForm.get('categoryId')?.touched }"
                                ></p-dropdown>
                                <div *ngIf="clinicForm.get('categoryId')?.invalid && clinicForm.get('categoryId')?.touched" class="text-red-500 text-sm mt-1">Please select a category</div>
                            </div>

                            <!-- Working Hours -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <p-calendar
                                        id="startTime"
                                        formControlName="startTime"
                                        [timeOnly]="true"
                                        hourFormat="24"
                                        placeholder="Select start time"
                                        [ngClass]="{ 'border-red-500': clinicForm.get('startTime')?.invalid && clinicForm.get('startTime')?.touched }"
                                    ></p-calendar>
                                    <div *ngIf="clinicForm.get('startTime')?.invalid && clinicForm.get('startTime')?.touched" class="text-red-500 text-sm mt-1">Start time is required</div>
                                </div>
                                <div>
                                    <label for="stopTime" class="block text-sm font-medium text-gray-700 mb-1">Stop Time</label>
                                    <p-calendar
                                        id="stopTime"
                                        formControlName="stopTime"
                                        [timeOnly]="true"
                                        hourFormat="24"
                                        placeholder="Select stop time"
                                        [ngClass]="{ 'border-red-500': clinicForm.get('stopTime')?.invalid && clinicForm.get('stopTime')?.touched }"
                                    ></p-calendar>
                                    <div *ngIf="clinicForm.get('stopTime')?.invalid && clinicForm.get('stopTime')?.touched" class="text-red-500 text-sm mt-1">Stop time is required</div>
                                </div>
                            </div>

                            <!-- Working Days -->
                            <div>
                                <label for="workingDays" class="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                                <p-multiSelect
                                    id="workingDays"
                                    formControlName="workingDays"
                                    [options]="daysOfWeek"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Select working days"
                                    [ngClass]="{ 'border-red-500': clinicForm.get('workingDays')?.invalid && clinicForm.get('workingDays')?.touched }"
                                ></p-multiSelect>
                                <div *ngIf="clinicForm.get('workingDays')?.invalid && clinicForm.get('workingDays')?.touched" class="text-red-500 text-sm mt-1">Please select at least one working day</div>
                            </div>

                            <!-- Vacation Periods -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Vacation Periods</label>
                                <div formArrayName="vacations" class="space-y-4">
                                    <div *ngFor="let vacation of vacations.controls; let i = index" [formGroupName]="i" class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label for="startDate-{{ i }}" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <p-calendar id="startDate-{{ i }}" formControlName="startDate" [showTime]="false" placeholder="Select start date"></p-calendar>
                                        </div>
                                        <div>
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
                                <button type="submit" pButton label="Register Clinic" class="p-button-success" [disabled]="clinicForm.invalid"></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </app-layout>
    `,
    styles: [
        `
            .p-fluid .p-field {
                margin-bottom: 1rem;
            }

            .p-error {
                color: #ff0000;
                font-size: 0.875rem;
            }

            .p-button-success {
                background-color: #059669; /* Tailwind's teal-600 */
                border-color: #059669;
            }

            .p-button-success:hover {
                background-color: #047857; /* Tailwind's teal-700 */
                border-color: #047857;
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
        private categoryService: CategoryService
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
    
        console.log(clinicRequest); // Debugging: Check the payload
    
        this.clinicService.createClinic(clinicRequest).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Clinic created successfully' });
            console.log(response);
            this.clinicForm.reset();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create clinic' });
          }
        );
      }
    }
    
    // Helper method to extract time in HH:mm:ss format
    private extractTime(time: any): string {
      console.log('Input time:', time); // Debugging
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
