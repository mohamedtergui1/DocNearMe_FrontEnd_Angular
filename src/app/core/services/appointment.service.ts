import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private api:HttpClient) { }

  getAppointmentByClinicIdAndDateAfterNow(clinic_id:string){
    return this.api.get("/appointment/getAppointmentsByClinicId/" + clinic_id)
  }


}
