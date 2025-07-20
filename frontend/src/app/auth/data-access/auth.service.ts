// data-access/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import {
  AuthRequest,
  LoginResponse,
  RegisterResponse,
  User,
  ApiError,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api'; // Ajusta tu URL base
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {
    // Cargar usuario si hay token válido al inicializar
    if (this.tokenService.isAuthenticated()) {
      this.loadCurrentUser().subscribe();
    }
  }

  login(credentials: AuthRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.access_token);
          this.loadCurrentUser().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  register(credentials: AuthRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.API_URL}/register`, credentials)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.API_URL}/profile`, { headers }).pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError(this.handleError)
    );
  }

  private loadCurrentUser(): Observable<User> {
    return this.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({ message: errorMessage } as ApiError));
  }
}
