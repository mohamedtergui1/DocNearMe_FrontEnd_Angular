import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor
import { AppointmentService } from '../../../core/services/appointment.service';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table'; // Import TableModule for p-table
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag'; // Import TagModule for p-tag
import { Appointment } from '../../../model/Appointment';
import { AppointmentStatus } from '../../../model/AppointmentStatus';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-of-today-widget',
  standalone: true, // If you're using standalone components
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule, DatePipe], // Import PrimeNG modules here
  template: `
    <p-card header="Today's Appointments">
      <!-- Mini Table -->
      <p-table [value]="appointments" [rows]="5" [paginator]="true" [responsive]="true">
        <ng-template pTemplate="header">
          <tr>
            <th>Subject</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-appointment>
          <tr>
            <td>{{ appointment.subject }}</td>
            <td>{{ appointment.startDateTime | date:'shortTime' }}</td>
            <td>{{ appointment.endDateTime | date:'shortTime' }}</td>
            <td>
              <!-- Add "Start Consultation" button for valid appointments -->
              <ng-container *ngIf="appointment.status === AppointmentStatus.VALID">
                <p-button 
                  label="Start Consultation" 
                  icon="pi pi-play" 
                  (onClick)="startConsultation(appointment.id)"
                  styleClass="p-button-success p-button-sm"
                ></p-button>
              </ng-container>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class AppointmentOfTodayWidgetComponent implements OnInit {

  appointments: Appointment[] = []; // Use the Appointment interface for typing

  // Expose AppointmentStatus enum to the template
  AppointmentStatus = AppointmentStatus;

  constructor(private appointmentService: AppointmentService,private router:Router) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentForAuthUserClinicValidAndofToday().subscribe((res: any) => {
      this.appointments = res.data;
    });
  }

  // Method to start the consultation
  startConsultation(appointmentId: string): void {
    this.router.navigate(['/medcine/dashboard/consultation/'+ appointmentId]);
  }
}