import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  get loading$() {
    return this._loadingSubject.asObservable();
  }

  setLoading(value: boolean): void {
    this._loadingSubject.next(value);
  }
}