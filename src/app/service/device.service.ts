import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppConstants } from '../models/app-constants';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Hàm lấy headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || ''; // Nếu null, gán chuỗi rỗng
    return new HttpHeaders(AppConstants.getAuthHeaders(token));
  }
  

  // Lấy danh sách thiết bị
  getDevices(searchText: string = ''): Observable<Device[]> {
    return this.http.get<Device[]>(`${AppConstants.apiUrl}/device?searchText=${encodeURIComponent(searchText)}`, { headers: this.getAuthHeaders() });
  }

  // Thêm thiết bị
  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(`${AppConstants.apiUrl}/adddevice`, device, { headers: this.getAuthHeaders() });
  }

  // Lấy thiết bị theo ID
  getDeviceById(id: string): Observable<Device> {
    return this.http.get<Device>(`${AppConstants.apiUrl}/device/${id}`, { headers: this.getAuthHeaders() });
  }

  // Cập nhật thiết bị
  updateDevice(id: string, device: Device): Observable<Device> {
    return this.http.put<Device>(`${AppConstants.apiUrl}/update/${id}`, device, { headers: this.getAuthHeaders() });
  }

  // Xóa thiết bị
  deleteDevice(id: string): Observable<Device> {
    return this.http.delete<Device>(`${AppConstants.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }

  // Lọc thiết bị theo trạng thái
  filterStatus(status: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${AppConstants.apiUrl}/device/filter?status=${status}`, { headers: this.getAuthHeaders() });
  }

  // Tìm kiếm thiết bị theo tên
  searchDevice(searchText: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${AppConstants.apiUrl}/device?searchText=${searchText}`, { headers: this.getAuthHeaders() });
  }

  assignDevice(deviceId: string, userId: string):Observable<string>{
    return this.http.post<string>(`${AppConstants.apiUrl}/assignment/${deviceId}/assign/${userId}`,{}, {headers: this.getAuthHeaders()});
  }

  getDeviceStatistics(): Observable<any> {
    return this.http.get<any>(`${AppConstants.apiUrl}/statistics`, {headers: this.getAuthHeaders()});
  }
}
