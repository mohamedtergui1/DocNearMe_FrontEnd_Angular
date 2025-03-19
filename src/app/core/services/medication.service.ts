import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  constructor(private api: HttpClient) { }

  getAllMedications() {
    return this.api.get("https://www.dwa.ma/api/v1/search?type=medicaments&word=a")
  }
}
