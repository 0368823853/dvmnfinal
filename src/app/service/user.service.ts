import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders{
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // hien thi user
  getUser():Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/loaduser`, {headers: this.getAuthHeaders()});
  }

  getUserById(id: string): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/loaduser/${id}`, {headers: this.getAuthHeaders()})
  }

  deleteUser(id: string): Observable<User>{
    return this.http.delete<User>(`${this.apiUrl}/user/delete/${id}`, {headers: this.getAuthHeaders()});
  }

  updateUser(id: string, user: User):Observable<User>{
    return this.http.put<User>(`${this.apiUrl}/user/${id}`, user, {headers: this.getAuthHeaders()});
  }

  filterRole(role: string): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/filter?role=${role}`, { headers: this.getAuthHeaders() })
  }

  searchUser(searchText: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/loaduser?searchText=${searchText}`, { headers: this.getAuthHeaders() });
  }
}
