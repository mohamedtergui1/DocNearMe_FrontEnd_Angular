import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  constructor(private api: HttpClient) { }

  searchMedications(query: string) {
    return this.api.get('/medications/search-medications', { params: { query } });
  }
}
