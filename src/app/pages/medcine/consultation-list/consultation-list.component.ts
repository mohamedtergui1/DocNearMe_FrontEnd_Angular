import { Component } from '@angular/core';
import { ConsultationService } from '../../../core/services/consultation.service';

@Component({
  selector: 'app-consultation-list',
  imports: [],
  template: `

    `
})
export class ConsultationListComponent {

  consultations:any[] = [];
  constructor(private consultationService:ConsultationService) { 
    this.consultationService.getConsultationsForAuthMedcine().subscribe({
      next: (res: any) => {
          this.consultations = res.data;
          console.log(res);
      }});
  }

}
