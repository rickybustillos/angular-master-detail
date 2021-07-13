import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/pages/auth/shared/user.model';

import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public token?: string | null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  autenticate(resource: User): Observable<any> {
    return this.http.post(`${environment.apiPath}/token`, resource).pipe(
      catchError(this.handleError),
      map((data) => {
        // console.log(data)
        this.token = data.token;
        localStorage.setItem('idToken', data.token);
      })
      )
  }

  autenticated(token: boolean = false): boolean | string | any {
    if( this.token === undefined && localStorage.getItem('idToken') != null ) {
      this.token = localStorage.getItem('idToken');
    }
    if(this.token === undefined) {
      this.router.navigateByUrl('/auth')
    }

    if(token && this.token !== undefined){
      return this.token;
    } else {
      return this.token !== undefined;
    }
  }

  logOut(): void {
    localStorage.removeItem('idToken');
    this.token = undefined;
    this.router.navigateByUrl('/');
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição: => ", error);
    return throwError(error);
  }
}
