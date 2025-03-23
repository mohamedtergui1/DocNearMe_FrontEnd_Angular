import { Component } from '@angular/core';
import { ConsultationService } from '../../../core/services/consultation.service';
import { ReusableTableComponent } from '../../../shared/componenets/reusable-table/reusable-table.component';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [ReusableTableComponent],
  template: `
    <app-reusable-table
      [data]="consultations"
      [cols]="cols"
      [globalFilterFields]="['patient.name', 'consultationDate', 'reason']"
      [showView]="true"
      [showEdit]="false"
      [showDelete]="false"
      [showCreate]="false"
      (viewItemEvent)="showDetails($event)"
    ></app-reusable-table>
  `
})
export class ConsultationListComponent {
  consultations: any[] = [];
  cols = [
    { field: 'patientName', header: 'Patient Name' },
    { field: 'consultationDate', header: 'Consultation Date' } ,
    { field: 'recoveryDays', header: 'Recovery Days' } ,
  ];

  constructor(private consultationService: ConsultationService, private router:Router) {
    this.consultationService.getConsultationsForAuthMedcine().subscribe({
      
      next: (res: any) => {
        console.log(res.data);

        this.consultations = res.data.map((consultation: any) => {
          return {
            ...consultation,
            patientName: consultation.medicalRecord.patient?.name || 'N/A', consultationDate: consultation.consultationDate.slice(0, 16)
            }});
      } 
    });
  }

  showDetails(item: any) {
      this.router.navigate(["medcine/dashboard/view-consultation-by-appointment-id/" + item.appointmentId])
  }
}