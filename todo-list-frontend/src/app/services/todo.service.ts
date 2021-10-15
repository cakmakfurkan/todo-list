import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from 'src/environments/environment';
import { Task } from '../Task';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http:HttpClient) { }

  getToDos(): Observable<any> {
    return this.http.get(`${apiURL}todo/get`, {withCredentials: true});
  }

  deleteToDo(id: string): Observable<any> {
    return this.http.post(`${apiURL}todo/delete`, { id: id }, {withCredentials: true});
  }

  updateToDo(task: Task): Observable<any> {
    return this.http.put(`${apiURL}todo/update`, task, {withCredentials: true});
  }

  createToDo(task: Task): Observable<any> {
    return this.http.post(`${apiURL}todo/create`, task, {withCredentials: true});
  }
}
