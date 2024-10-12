import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginReq } from '../interfaces/login-req.interface';
import { catchError, map, Observable, of, take, tap, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { environment } from '../../../environments/environment.development';
import { AuthStatus } from '../interfaces/auth.enum';
import { ErrorLoginResponse } from '../interfaces/error.response';
import Swal from 'sweetalert2';
import { RegisterRequest, RegisterResponse } from '../interfaces/register.interface';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private _currentUser = signal<LoginResponse | RegisterResponse | null | undefined>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);


  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());


  constructor() {
    // console.log (this.authStatus());
    this.checkAuthStatus().subscribe();
  }

  login(body: LoginReq): Observable<LoginResponse | boolean> {

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body).pipe(

      tap((res: LoginResponse) => {
        return this.setAuthentication(res);
      }),
      take(1),
      map(() => true),
      catchError((error: ErrorLoginResponse) => {
        return throwError(() => {
          this._currentUser.set(null);
          this._authStatus.set(AuthStatus.notAuthenticated);
          localStorage.removeItem('token');
          Swal.fire('Error', error.error.message, 'error');
          return error.error.message;
        });
      })
    )
  }

  resetPass(email: string , password: string) {
    return this.http.patch(`${environment.apiUrl}/auth/update/password`, { email, password }).pipe(
      take(1),
      map(() => true),
      catchError((error: ErrorLoginResponse) => {
        return throwError(() => {
          Swal.fire('Error', error.error.message, 'error');
          return error.error.message;
        });
      })
    )
  }

  private setAuthentication(response: LoginResponse | RegisterResponse | null | undefined, token?: string): LoginResponse | RegisterResponse | boolean | null | undefined {
    this._currentUser.set(response);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', response!.token);
    return response;
  }


  public register(body: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth`, body).pipe(
      tap((res: RegisterResponse) => {
        return this.setAuthentication(res);
      }),
      take(1),
      map(() => true),
      catchError((error: ErrorLoginResponse) => {
        return throwError(() => {
          this._currentUser.set(null);
          this._authStatus.set(AuthStatus.notAuthenticated);
          localStorage.removeItem('token');
          Swal.fire('Error', error.error.message, 'error');
          return error.error.message;
        });
      })
    )
  }

  public isValidField(field: string, myForm: FormGroup) {
    return myForm.controls[field].errors && myForm.controls[field].touched;
  }


  logout(): void {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('token');
  }



  checkAuthStatus(): Observable< LoginResponse | RegisterResponse | boolean> {

    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get< LoginResponse | RegisterResponse>(`${environment.apiUrl}/auth/check-token/refresh`, { headers: header }).pipe(
      tap((response: LoginResponse | RegisterResponse | null | undefined) => {
        return this.setAuthentication(response);
      }),
      take(1),
      map(() => {
        return true;
      }),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

}
