import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Hàm lấy headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // Lấy danh sách thiết bị
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/device`, { headers: this.getAuthHeaders() });
  }

  // Thêm thiết bị
  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}/adddevice`, device, { headers: this.getAuthHeaders() });
  }

  // Lấy thiết bị theo ID
  getDeviceById(id: string): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/device/${id}`, { headers: this.getAuthHeaders() });
  }

  // Cập nhật thiết bị
  updateDevice(id: string, device: Device): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/update/${id}`, device, { headers: this.getAuthHeaders() });
  }

  // Xóa thiết bị
  deleteDevice(id: string): Observable<Device> {
    return this.http.delete<Device>(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }

  // Lọc thiết bị theo trạng thái
  filterStatus(status: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/device/filter?status=${status}`, { headers: this.getAuthHeaders() });
  }

  // Tìm kiếm thiết bị theo tên
  searchDevice(searchText: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/device?searchText=${searchText}`, { headers: this.getAuthHeaders() });
  }
}
