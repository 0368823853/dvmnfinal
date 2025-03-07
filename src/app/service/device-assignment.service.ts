import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../models/app-constants';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DeviceAssignment } from '../models/deviceassignment.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceAssignmentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
      const token = this.authService.getToken() || ''; // Nếu null, gán chuỗi rỗng
      return new HttpHeaders(AppConstants.getAuthHeaders(token));
    }

  getUserDevices():Observable<DeviceAssignment[]>{
    return this.http.get<DeviceAssignment[]>(`${AppConstants.apiUrl}/assignment/my-device`, {headers: this.getAuthHeaders()});
  }

  unAssignment(deviceAssignmentId: string):Observable<string>{
    return this.http.post<string>(`${AppConstants.apiUrl}/assignment/unasisign-device?deviceAssignmentId=${deviceAssignmentId}`, deviceAssignmentId, {headers: this.getAuthHeaders()});
  }

  getAllAssignment():Observable<DeviceAssignment[]>{
    return this.http.get<DeviceAssignment[]>(`${AppConstants.apiUrl}/assignment/admin_device`, {headers: this.getAuthHeaders()});
  }

  confirmAssignment(deviceAssignmentId: string):Observable<string>{
    return this.http.post<string>(`${AppConstants.apiUrl}/assignment/confirm-device?deviceAssignmentId=${deviceAssignmentId}`, deviceAssignmentId, {headers: this.getAuthHeaders()});
  }

  searchDevice(searchText: string): Observable<DeviceAssignment[]> {
    return this.http.get<DeviceAssignment[]>(`${AppConstants.apiUrl}/assignment/admin_device?searchText=${searchText}`, { headers: this.getAuthHeaders() });
  }
}
