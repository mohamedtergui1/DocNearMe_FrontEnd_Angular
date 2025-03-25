import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cons } from 'rxjs';
import { Consultation } from '../../model/Consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private api:HttpClient) { }

  createConsultation(consultation:Consultation,  appointmentId:string) {
    return this.api.post('/consultation/'+ appointmentId, { ...consultation , appointmentId });
  }

  getConsultationByAppointmentId(appointmentId: string) {
    return this.api.get('/consultation/getConsultationByAppointmentId/' + appointmentId);
  }

  getConsultationsForAuthMedcine(){
    return this.api.get('/consultation/getConsultationsForAuthMedicine');
  }
  getConsultationsForAuthPatient(){
    return this.api.get('/consultation/getConsultationsForAuthPatient');
  }

}
