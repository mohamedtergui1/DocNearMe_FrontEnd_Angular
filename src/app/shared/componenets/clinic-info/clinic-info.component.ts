import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton'; // Import SkeletonModule
import { Clinic } from '../../../model/Clinic';

@Component({
  selector: 'app-clinic-info',
  standalone: true,
  imports: [CommonModule, CardModule, FieldsetModule, TagModule, SkeletonModule], // Add SkeletonModule
  template: `
    <p-card [header]="ClinicDetails">
      <div class="grid">
        <!-- Basic Information -->
        <div class="col-12 md:col-6">
          <p-fieldset legend="Basic Information">
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
        <div class="col-12 md:col-6">
          <p-fieldset legend="Working Hours">
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
        <div class="col-12">
          <p-fieldset legend="Working Days">
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
        <div class="col-12">
          <p-fieldset legend="Vacation Periods">
            <ng-container *ngIf="!loading; else skeletonVacations">
              <div *ngFor="let vacation of clinic?.vacations" class="mb-3">
                <div class="grid">
                  <div class="col-4 font-bold text-primary">Start Date:</div>
                  <div class="col-8">{{ vacation.startDate || 'N/A' }}</div>
                  <div class="col-4 font-bold text-primary">End Date:</div>
                  <div class="col-8">{{ vacation.endDate || 'N/A' }}</div>
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
    </p-card>
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
export class ClinicInfoComponent {
  @Input() clinic: Clinic | null = null; 
  @Input() loading: boolean = true; 
  @Input() ClinicDetails: string = '';
}