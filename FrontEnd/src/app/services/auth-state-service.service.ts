import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateServiceService {

  private authenticatedSource = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSource.asObservable();

  setAuthenticated(isAuthenticated: boolean): void {
    this.authenticatedSource.next(isAuthenticated);
  }
}

