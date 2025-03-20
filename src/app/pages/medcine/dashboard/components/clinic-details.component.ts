import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { Clinic } from '../../../../model/Clinic';
import { SkeletonModule } from 'primeng/skeleton'; // For loading state

@Component({
  selector: 'app-clinic-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FieldsetModule,
    TagModule,
    SkeletonModule // For loading state
  ],
  template: `
    <div class="mt-1 mb-4">
      <!-- Loading State -->
      <ng-template #loading>
        <p-card>
          <div class="grid">
            <div class="col-12 md:col-6">
              <p-fieldset legend="Basic Information">
                <div class="grid">
                  <div class="col-4">
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </div>
                  <div class="col-8">
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </div>
                </div>
              </p-fieldset>
            </div>
            <div class="col-12 md:col-6">
              <p-fieldset legend="Working Hours">
                <div class="grid">
                  <div class="col-4">
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </div>
                  <div class="col-8">
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </div>
                </div>
              </p-fieldset>
            </div>
            <div class="col-12">
              <p-fieldset legend="Working Days">
                <div class="flex flex-wrap gap-2">
                  <p-skeleton width="5rem" height="2rem"></p-skeleton>
                  <p-skeleton width="5rem" height="2rem"></p-skeleton>
                </div>
              </p-fieldset>
            </div>
            <div class="col-12">
              <p-fieldset legend="Vacation Periods">
                <div class="grid">
                  <div class="col-4">
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </div>
                  <div class="col-8">
                    <p-skeleton width="100%" height="1.5rem"></p-skeleton>
                  </div>
                </div>
              </p-fieldset>
            </div>
          </div>
        </p-card>
      </ng-template>

      <!-- Clinic Details -->
      <ng-container *ngIf="clinic; else loading">
        <p-card header="Clinic Details">
          <div class="grid">
            <!-- Basic Information -->
            <div class="col-12 md:col-6">
              <p-fieldset legend="Basic Information">
                <div class="grid">
                  <div class="col-4 font-bold">Name:</div>
                  <div class="col-8">{{ clinic.clinicName }}</div>
                  <div class="col-4 font-bold">Address:</div>
                  <div class="col-8">{{ clinic.clinicAddress }}</div>
                  <div class="col-4 font-bold">Category:</div>
                  <div class="col-8">{{ clinic.categoryName || 'N/A' }}</div>
                </div>
              </p-fieldset>
            </div>

            <!-- Working Hours -->
            <div class="col-12 md:col-6">
              <p-fieldset legend="Working Hours">
                <div class="grid">
                  <div class="col-4 font-bold">Start Time:</div>
                  <div class="col-8">{{ clinic.startTime || 'N/A' }}</div>
                  <div class="col-4 font-bold">End Time:</div>
                  <div class="col-8">{{ clinic.stopTime || 'N/A' }}</div>
                </div>
              </p-fieldset>
            </div>

            <!-- Working Days -->
            <div class="col-12">
              <p-fieldset legend="Working Days">
                <div class="flex flex-wrap gap-2">
                  <p-tag *ngFor="let day of clinic.workingDays" [value]="day" severity="info"></p-tag>
                  <p *ngIf="!clinic.workingDays?.length">No working days specified.</p>
                </div>
              </p-fieldset>
            </div>

            <!-- Vacation Periods -->
            <div class="col-12">
              <p-fieldset legend="Vacation Periods">
                <div *ngFor="let vacation of clinic.vacations" class="mb-3">
                  <div class="grid">
                    <div class="col-4 font-bold">Start Date:</div>
                    <div class="col-8">{{ vacation.startDate || 'N/A' }}</div>
                    <div class="col-4 font-bold">End Date:</div>
                    <div class="col-8">{{ vacation.endDate || 'N/A' }}</div>
                  </div>
                </div>
                <p *ngIf="!clinic.vacations?.length">No vacation periods specified.</p>
              </p-fieldset>
            </div>
          </div>
        </p-card>
      </ng-container>

      <!-- Error State -->
      <ng-container *ngIf="error">
        <p-card header="Error">
          <p class="text-red-500">{{ error }}</p>
        </p-card>
      </ng-container>
    </div>
  `,
  styles: [`
    .font-bold {
      font-weight: bold;
    }
    .text-red-500 {
      color: #ef4444;
    }
  `]
})
export class ClinicDetailsComponent implements OnInit {
  clinic: Clinic | null = null;
  error: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.parent?.data.subscribe({
      next: (data) => {
        this.clinic = data['clinic']?.data || null;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clinic details. Please try again later.';
        this.loading = false;
        console.error('Error fetching clinic details:', err);
      }
    });
  }
}
