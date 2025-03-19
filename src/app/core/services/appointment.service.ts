import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '../../model/Appointment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    constructor(private api: HttpClient) {}

    getAppointmentByClinicIdAndDateAfterNow(clinic_id: string) {
        return this.api.get('/appointment/getAppointmentsByClinicId/' + clinic_id);
    }

    createAppointment(data: Omit<Appointment, 'patientId' | 'id' | 'status'>) {
        return this.api.post('/appointment', data);
    }

    updateAppointment(data: Appointment) {
        return this.api.put('/appointment/' + data.id, data);
    }

    deleteAppointment(id: string) {
        return this.api.delete('/appointment/' + id);
    }

    getAppointmentForAuthUserClinic(){
      return this.api.get('/appointment/getAppointmentForAuthUserClinic')
    }

    getAppointmentForAuthUserClinicValidAndofToday(){
      return this.api.get('/appointment/getAppointmentForAuthUserClinicValidAndofToday')
    }

    getAppointmentById(id: string) {
        return this.api.get('/appointment/' + id);
    }

    chnageStatusOfAppointmentFromtheMedicine(data:Appointment){
        return this.api.put('/appointment/medicine/chnage-appointment-status/' + data.id,data);
    }

}
