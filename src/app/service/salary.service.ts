import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AppConstants } from '../models/app-constants';
import { Observable } from 'rxjs';
import { Salary } from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }
  
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || ''; // Nếu null, gán chuỗi rỗng
    return new HttpHeaders(AppConstants.getAuthHeaders(token));
  }

  getSalaryByUser(userId: string): Observable<Salary[]>{
    return this.http.get<Salary[]>(`${AppConstants.apiUrl}/salary/my-salary/${userId}`, {headers: this.getAuthHeaders()});
  }

  calculateSalary(userId: string, startDate: string, endDate: string): Observable<Salary> {
    return this.http.get<Salary>(`${AppConstants.apiUrl}/salary/calculate?userId=${userId}&startDate=${startDate}&endDate=${endDate}` ,{headers: this.getAuthHeaders()});
  }

  // ✅ Xác nhận & lưu lương vào DB
  confirmSalary(salary: Salary): Observable<string> {
    return this.http.post<string>(`${AppConstants.apiUrl}/salary/confirm`, salary, {headers: this.getAuthHeaders()});
  }

  getAllSalary(searchText?: string): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${AppConstants.apiUrl}/salary?searchText=${searchText || ''}`, {headers: this.getAuthHeaders()});
  }
}
