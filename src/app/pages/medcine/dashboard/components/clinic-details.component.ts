import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { Clinic } from '../../../../model/Clinic';
import { SkeletonModule } from 'primeng/skeleton'; // For loading state
import { ClinicInfoComponent } from '../../../../shared/componenets/clinic-info/clinic-info.component';

@Component({
  selector: 'app-clinic-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FieldsetModule,
    TagModule,
    SkeletonModule,
    ClinicInfoComponent
  ],
  template: `
  <p-card [header]="  'My Clinic Information'">
  <app-clinic-info [clinic]="clinic" [loading]="loading" [isWorkingHoursCollapsed]="true"  [isVacationPeriodsCollapsed]="true"  [isWorkingDaysCollapsed]="true"  ></app-clinic-info>
  </p-card>
  `

})

export class ClinicDetailsComponent implements OnInit {
  clinic: Clinic | null = null;
  error: string | null = null;
  loading = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.parent?.data.subscribe({
      next: (data) => {
        this.clinic = data['clinic']?.data || null;
        this.loading = false;
      },
      error: (err) => {

        this.loading = false;

      }
    });
  }
}