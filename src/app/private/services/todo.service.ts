import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { TodoList } from '../interfaces/todo-list.interface';
import { environment } from '../../../environments/environment';
import { TodoPatchReq } from '../interfaces/todo-update-todo.interface';
import { ResponseUpdateTodo } from '../interfaces/todo-update.response';
import { AuthStatus } from '../../public/interfaces/auth.enum';

// TODO guard para solo permitir acceso a usuarios autenticados y que esten  logueados


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private http = inject(HttpClient);
  private _todos = signal<TodoList | null | undefined >(null);
  public todos = computed(() => this._todos());


  constructor() { }


  getTodos(limit?: string, page?: string): Observable<TodoList>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const params = new HttpParams().set('limit', limit!).set('page', page!);
    return this.http.get<TodoList>(`${environment.apiUrl}/todolist`,{headers,params}).pipe(
      tap( (tdos) => {
        this._todos.set(tdos);
        // console.log (tdos);
      })
    )
  }

  patchTodo(body?: TodoPatchReq, id?: string): Observable<ResponseUpdateTodo | any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch<ResponseUpdateTodo>(`${environment.apiUrl}/todolist/${id}`, body, {headers}).pipe(
      catchError( (error) =>{
        console.log (error);
        return error;
      })
    )
  }

  getOneTodo(id?: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any >(`${environment.apiUrl}/todolist/${id}`,{headers}).pipe(
      tap( (tdos) => {
        // console.log (tdos);
      })
    )
  }



  createTodo(body?: TodoPatchReq): Observable<ResponseUpdateTodo | any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<ResponseUpdateTodo>(`${environment.apiUrl}/todolist`, body, {headers}).pipe(
      catchError( (error) =>{
        console.log (error);
        return error;
      })
    )
  }

  deleteTodo(id?: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.delete<any >(`${environment.apiUrl}/todolist/${id}`,{headers}).pipe(
      tap( (tdos) => {
        console.log (tdos);
      })
    )
  }

}
