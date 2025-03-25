import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { ConsultationDetailsCardComponent } from './componenets/consiltation-details-card/consultation-details-card.component';

@Component({
  selector: 'app-view-consultation',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ConsultationDetailsCardComponent],
  template: `
  <app-consultation-details-card [consultation]="consultation"></app-consultation-details-card>
  <div class="h-5" ></div>
  <p-card >
    <div class="p-grid p-justify-center  ">
      <button pButton type="button" label="Back" icon="pi pi-arrow-left" (click)="goBack()"></button>
    </div>
  </p-card>
  `,
})
export class ViewConsultationComponent implements OnInit {
  consultation: any = null; // Use 'any' for dynamic JSON data

  constructor(
    private route: ActivatedRoute,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    if (appointmentId) {
      this.loadConsultationDetails(appointmentId);
    }
  }

  loadConsultationDetails(appointmentId: string): void {
    this.consultationService.getConsultationByAppointmentId(appointmentId).subscribe({
      next: (res: any) => {
        this.consultation = res.data;
      },
      error: (err) => {
        console.error('Failed to load consultation details:', err);
      },
    });
  }

  goBack(): void {
    window.history.back();
  }
}