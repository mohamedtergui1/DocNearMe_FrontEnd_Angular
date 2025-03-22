import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton'; // Import SkeletonModule
import { Clinic } from '../../../model/Clinic';
import { ButtonModule } from 'primeng/button'; // Import ButtonModule for toggle buttons

@Component({
  selector: 'app-clinic-info',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    TagModule,
    SkeletonModule,
    ButtonModule, // Add ButtonModule for toggle buttons
  ],
  template: `
    <div >
      <div class="grid">
        <!-- Basic Information -->
        <div class="col-12 md:col-6" *ngIf="showBasicInfo">
          <p-fieldset legend="Basic Information" [toggleable]="true" [collapsed]="isBasicInfoCollapsed">
            <div class="grid">
              <div class="py-1">
                <span class="col-4 font-bold text-primary">Name:</span>
                <span class="col-8">
                  <ng-container *ngIf="!loading; else skeleton">
                    {{ clinic?.clinicName || 'N/A' }}
                  </ng-container>
                  <ng-template #skeleton>
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </ng-template>
                </span>
              </div>
              <div class="py-1">
                <span class="col-4 font-bold text-primary">Address:</span>
                <span class="col-8">
                  <ng-container *ngIf="!loading; else skeleton">
                    {{ clinic?.clinicAddress || 'N/A' }}
                  </ng-container>
                  <ng-template #skeleton>
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </ng-template>
                </span>
              </div>
              <div class="py-1">
                <span class="col-4 font-bold text-primary">Category:</span>
                <span class="col-8">
                  <ng-container *ngIf="!loading; else skeleton">
                    {{ clinic?.categoryName || 'N/A' }}
                  </ng-container>
                  <ng-template #skeleton>
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </ng-template>
                </span>
              </div>
            </div>
          </p-fieldset>
        </div>

        <!-- Working Hours -->
        <div class="col-12 md:col-6" *ngIf="showWorkingHours">
          <p-fieldset legend="Working Hours" [toggleable]="true" [collapsed]="isWorkingHoursCollapsed">
            <div class="grid">
              <div class="col-4 font-bold text-primary">Start Time:</div>
              <div class="col-8">
                <ng-container *ngIf="!loading; else skeleton">
                  {{ clinic?.startTime || 'N/A' }}
                </ng-container>
                <ng-template #skeleton>
                  <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                </ng-template>
              </div>
              <div class="col-4 font-bold text-primary">End Time:</div>
              <div class="col-8">
                <ng-container *ngIf="!loading; else skeleton">
                  {{ clinic?.stopTime || 'N/A' }}
                </ng-container>
                <ng-template #skeleton>
                  <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                </ng-template>
              </div>
            </div>
          </p-fieldset>
        </div>

        <!-- Working Days -->
        <div class="col-12" *ngIf="showWorkingDays">
          <p-fieldset legend="Working Days" [toggleable]="true" [collapsed]="isWorkingDaysCollapsed">
            <div class="flex flex-wrap gap-2">
              <ng-container *ngIf="!loading; else skeletonDays">
                <p-tag *ngFor="let day of clinic?.workingDays" [value]="day" severity="info"></p-tag>
                <p *ngIf="!clinic?.workingDays?.length">No working days specified.</p>
              </ng-container>
              <ng-template #skeletonDays>
                <p-skeleton width="5rem" height="2rem"></p-skeleton>
                <p-skeleton width="5rem" height="2rem"></p-skeleton>
              </ng-template>
            </div>
          </p-fieldset>
        </div>

        <!-- Vacation Periods -->
        <div class="col-12" *ngIf="showVacationPeriods">
          <p-fieldset legend="Vacation Periods" [toggleable]="true" [collapsed]="isVacationPeriodsCollapsed">
            <ng-container *ngIf="!loading; else skeletonVacations">
              <div *ngFor="let vacation of clinic?.vacations" class="mb-3">
                <div class="grid">
                  <div class="col-4 font-bold text-primary">Start Date:</div>
                  <div class="col-8">{{ transform(vacation.startDate) || 'N/A' }}</div>
                  <div class="col-4 font-bold text-primary">End Date:</div>
                  <div class="col-8">{{ transform(vacation.endDate) || 'N/A' }}</div>
                </div>
              </div>
              <p *ngIf="!clinic?.vacations?.length">No vacation periods specified.</p>
            </ng-container>
            <ng-template #skeletonVacations>
              <div class="grid">
                <div class="col-4">
                  <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                </div>
                <div class="col-8">
                  <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                </div>
              </div>
            </ng-template>
          </p-fieldset>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .font-bold {
      font-weight: bold;
    }
    .text-primary {
      color: var(--primary-color);
    }
  `]
})
export class ClinicInfoComponent implements OnInit {
  @Input() clinic: Clinic | null = null; // Clinic data

  @Input() loading: boolean = true; // Loading state

  // Props to control visibility of sections
  @Input() showBasicInfo: boolean = true; // Show/hide Basic Information section
  @Input() showWorkingHours: boolean = true; // Show/hide Working Hours section
  @Input() showWorkingDays: boolean = true; // Show/hide Working Days section
  @Input() showVacationPeriods: boolean = true; // Show/hide Vacation Periods section

  // Props to control collapsed state of sections
  @Input() isBasicInfoCollapsed: boolean = false;
  @Input() isWorkingHoursCollapsed: boolean = false;
  @Input() isWorkingDaysCollapsed: boolean = false;
  @Input() isVacationPeriodsCollapsed: boolean = false;

  ngOnInit(): void {
    // Simulate a delay of 500ms (0.5 seconds) before hiding the skeleton
    setTimeout(() => {
      if(this.loading){
        this.loading = false;
      }
    
    }, 500);
  }

  // Methods to toggle sections
  toggleBasicInfo(): void {
    this.isBasicInfoCollapsed = !this.isBasicInfoCollapsed;
  }

  toggleWorkingHours(): void {
    this.isWorkingHoursCollapsed = !this.isWorkingHoursCollapsed;
  }

  toggleWorkingDays(): void {
    this.isWorkingDaysCollapsed = !this.isWorkingDaysCollapsed;
  }

  toggleVacationPeriods(): void {
    this.isVacationPeriodsCollapsed = !this.isVacationPeriodsCollapsed;
  }

  transform(timeString: string): string {
    if (!timeString) return '';
    return timeString.split(':').slice(0, 2).join(':'); 
  }

  
}