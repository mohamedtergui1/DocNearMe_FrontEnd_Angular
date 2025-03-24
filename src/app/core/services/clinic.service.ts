import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clinic } from '../../model/Clinic';



export interface ClinicRequest{
  clinicName:string
  clinicAddress:string
  categoryId:string
}

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private api:HttpClient) { }

  getClinicForAuthUser(): Observable<Clinic> {
    return this.api.get<Clinic>("/clinic/forAuthUser")
  }

  createClinic(clinic:ClinicRequest): Observable<Clinic> {
      return this.api.post<Clinic>("/clinic",clinic)
  }

  allClinics(){
    return this.api.get("/clinic")
  }

  getClinicById(id:string){
    return this.api.get("/clinic/" + id)
  }
  updateClinic(clinicId:string,clinic:ClinicRequest){
    return this.api.put("/clinic/" + clinicId,clinic)

  }
}
