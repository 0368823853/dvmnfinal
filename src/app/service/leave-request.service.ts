import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AppConstants } from '../models/app-constants';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../models/leave-request.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || ''; // Nếu null, gán chuỗi rỗng
    return new HttpHeaders(AppConstants.getAuthHeaders(token));
  }

  createLeaveRequest(userId: string, leaveData: any): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${AppConstants.apiUrl}/leave?userId=${userId}`, leaveData, {headers: this.getAuthHeaders()});
  }

  // Nhân viên xem danh sách nghỉ phép của mình
  getUserLeaveRequests(userId: string): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${AppConstants.apiUrl}/leave/${userId}`, {headers: this.getAuthHeaders()});
  }

  deleteLeaveRequest(leaveRequestId: string, userId: string): Observable<any> {
    return this.http.delete(`${AppConstants.apiUrl}/leave/${leaveRequestId}?userId=${userId}`, {headers: this.getAuthHeaders()});
  }
  

  // Admin cập nhật trạng thái đơn nghỉ phép
  updateLeaveStatus(leaveRequestId: string, status: string): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${AppConstants.apiUrl}/leave/${leaveRequestId}/status?status=${status}`, {}, {headers: this.getAuthHeaders()});
  }
  
  // Admin xem tất cả đơn nghỉ phép
  getAllLeaveRequests(searchText?: string): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${AppConstants.apiUrl}/leave?searchText=${searchText || ''}`, {headers: this.getAuthHeaders()});
  }

  // Admin xóa đơn nghỉ phép
  deleteLeaveRequestByAdmin(leaveRequestId: string): Observable<any> {
    return this.http.delete(`${AppConstants.apiUrl}/leave/${leaveRequestId}/admin`, {headers: this.getAuthHeaders()});
  }

  getLeaveStatistics(): Observable<any> {
    return this.http.get<any>(`${AppConstants.apiUrl}/leave/repostLeave`, {headers: this.getAuthHeaders()});
  }
}
