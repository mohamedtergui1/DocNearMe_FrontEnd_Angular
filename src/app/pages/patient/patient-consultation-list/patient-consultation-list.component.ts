import { Component } from '@angular/core';
import { ConsultationService } from '../../../core/services/consultation.service';
import { ReusableTableComponent } from '../../../shared/componenets/reusable-table/reusable-table.component';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-patient-consultation-list',
  standalone: true,
  imports: [ReusableTableComponent],
  template: `
    <app-reusable-table
      [data]="consultations"
      [cols]="cols"
      [globalFilterFields]="['clinicName', 'consultationDate', 'reason']"
      [showView]="true"
      [showEdit]="false"
      [showDelete]="false"
      [showCreate]="false"
      (viewItemEvent)="showDetails($event)"
    ></app-reusable-table>
  `
})
export class PatientConsultationListComponent {
  consultations: any[] = [];
  cols = [
    { field: 'clinicName', header: 'clinic Name' },
    { field: 'consultationDate', header: 'Consultation Date' } ,
    { field: 'recoveryDays', header: 'Recovery Days' } ,
    { field: 'medicationDosage', header: 'Number Of Medication' } ,
  ];

  constructor(private consultationService: ConsultationService, private router:Router) {
    this.consultationService.getConsultationsForAuthPatient().subscribe({
      
      next: (res: any) => {
        console.log(res.data);

        this.consultations = res.data.map((consultation: any) => {
          return {
            ...consultation,
            clinicName: consultation.clinic.clinicName || 'N/A', consultationDate: consultation.consultationDate.slice(0, 16) , medicationDosage: consultation.medicationsDosageSchedule.length || 'N/A'
            }});
      } 
    });
  }

  showDetails(item: any) {
      this.router.navigate(["patient/dashboard/view-consultation-by-appointment-id/" + item.appointmentId])
  }
}