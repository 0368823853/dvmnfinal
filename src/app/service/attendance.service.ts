import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AppConstants } from '../models/app-constants';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';
import { AttendanceSummary } from '../models/attendancesummary.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || ''; // Nếu null, gán chuỗi rỗng
    return new HttpHeaders(AppConstants.getAuthHeaders(token));
  }

  checkIn(userId: String): Observable<Attendance[]>{
    return this.http.post<Attendance[]>(`${AppConstants.apiUrl}/attendance/check-in?userId=${userId}`, {}, {headers: this.getAuthHeaders()});
  }

  checkOut(userId: String): Observable<Attendance[]>{
    return this.http.post<Attendance[]>(`${AppConstants.apiUrl}/attendance/check-out?userId=${userId}`, {}, {headers: this.getAuthHeaders()});
  }

  getUserAttendance(userId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${AppConstants.apiUrl}/attendance/${userId}`, {headers: this.getAuthHeaders()});
  }

  getLastAttendance(userId: string): Observable<Attendance | null> {
    return this.http.get<Attendance | null>(`${AppConstants.apiUrl}/attendance/${userId}`, {headers: this.getAuthHeaders()});
  }

  getAllAttendance(searchText?: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${AppConstants.apiUrl}/attendance?searchText=${searchText || ''}`, {headers: this.getAuthHeaders()});
  }
  getUserAttendanceByDate(userId: string, startDate: string, endDate: string) {
    return this.http.get<Attendance[]>(`${AppConstants.apiUrl}/attendance/filter?userId=${userId}&startDate=${startDate}&endDate=${endDate}`, {headers: this.getAuthHeaders()});
  }
  getAttendanceByAdmin(userId: string, startDate: string, endDate: string) {
    let url = `${AppConstants.apiUrl}/attendance/admin/filter?startDate=${startDate}&endDate=${endDate}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return this.http.get<Attendance[]>(url, {headers: this.getAuthHeaders()});
  }

  getAttendanceSummary(userName: string, startDate: string, endDate: string): Observable<AttendanceSummary>{
    let url = `${AppConstants.apiUrl}/attendance/summary?startDate=${startDate}&endDate=${endDate}`;
    if (userName) {
      url += `&userName=${userName}`;
    }
    return this.http.get<AttendanceSummary>(url, {headers: this.getAuthHeaders()});
  }
  
}
