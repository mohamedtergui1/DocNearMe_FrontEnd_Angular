import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private api:HttpClient) { }

  getCategories(){
    return this.api.get("/auth/categories")
  }
}
  