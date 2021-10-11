import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${apiURL}auth/login`, data, {withCredentials: true});
  }

  signUp(data: any): Observable<any> {
    return this.http.post(`${apiURL}auth/createUser`, data, {withCredentials: true});
  }

  logout(): Observable<any> {
    return this.http.get(`${apiURL}auth/logout`, {withCredentials: true})
  }
}

