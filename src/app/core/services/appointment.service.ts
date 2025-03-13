import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '../../model/Appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private api:HttpClient) { }

  getAppointmentByClinicIdAndDateAfterNow(clinic_id:string){
    return this.api.get("/appointment/getAppointmentsByClinicId/" + clinic_id)
  }

  createAppointment(data:Omit<Appointment, "patientId" | "id" | "status">){
    return this.api.post("/appointment",data)
  }


}
