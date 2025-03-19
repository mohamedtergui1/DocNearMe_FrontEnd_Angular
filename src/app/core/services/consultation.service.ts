import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cons } from 'rxjs';
import { Consultation } from '../../model/Consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private api:HttpClient) { }

  createConsultation(consultation:Consultation){
    return this.api.post('/consultation', consultation);
  }
}
