import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { AppConstants } from '../models/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: HoanNTh: tại sao k dùng tokenKey trong app-constants.ts


  constructor(private http: HttpClient, private router: Router) { }

  getToken():string|null{
    return localStorage.getItem(AppConstants.tokenKey);
  }

  saveToken(token: string){
    localStorage.setItem(AppConstants.tokenKey, token);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      //TODO: HoanNTh: bỏ log, chỉ để lúc test

      return decoded?.role || null; // Trả về role nếu có
    } catch (error) {

      return null;
    }
  }

  isAdmin(): boolean{
    return this.getUserRole()==='ADMIN';
  }

  login(username: string, password: string): Observable<string>{
    return this.http.post(`${AppConstants.apiUrl}/user/login`,{ username, password}, { responseType: 'text' });
  }

  logout(){
    localStorage.removeItem(AppConstants.tokenKey);
    this.router.navigate(['/login'])
  }

  register(Users: any): Observable<any>{
    return this.http.post(`${AppConstants.apiUrl}/user/register`, Users);
  }

  handleUnauthorizadError(error: any){
    if(error.status === 401){
      alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      this.router.navigate(['/auth']);
    }
  }
}
