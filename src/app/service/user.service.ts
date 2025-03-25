import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AppConstants } from '../models/app-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || ''; // Nếu null, gán chuỗi rỗng
    return new HttpHeaders(AppConstants.getAuthHeaders(token));
  }

  // hien thi user
  getUser(searchText: string =''):Observable<User[]>{
    return this.http.get<User[]>(`${AppConstants.apiUrl}/loaduser?searchText=${encodeURIComponent(searchText)}`, {headers: this.getAuthHeaders()});
  }

  getUserById(id: string): Observable<User>{
    return this.http.get<User>(`${AppConstants.apiUrl}/loaduser/${id}`, {headers: this.getAuthHeaders()})
  }

  deleteUser(id: string): Observable<User>{
    return this.http.delete<User>(`${AppConstants.apiUrl}/user/delete/${id}`, {headers: this.getAuthHeaders()});
  }

  updateUser(id: string, user: User):Observable<User>{
    return this.http.put<User>(`${AppConstants.apiUrl}/user/${id}`, user, {headers: this.getAuthHeaders()});
  }

  filterRole(role: string): Observable<User[]>{
    return this.http.get<User[]>(`${AppConstants.apiUrl}/filter?role=${role}`, { headers: this.getAuthHeaders() })
  }

  searchUser(searchText: string): Observable<User[]> {
    return this.http.get<User[]>(`${AppConstants.apiUrl}/loaduser?searchText=${searchText}`, { headers: this.getAuthHeaders() });
  }

  updatePassword(data:{oldPassword: string; newPassword: string}){
    return this.http.put(`${AppConstants.apiUrl}/user/updatePassword`, data, {headers: this.getAuthHeaders()});
  }
  getUserStatistics(): Observable<any> {
    return this.http.get<any>(`${AppConstants.apiUrl}/repost`, {headers: this.getAuthHeaders()});
  }
}
