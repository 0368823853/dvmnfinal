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

  private tokenkey = 'jwtToken';

  constructor(private http: HttpClient, private router: Router) { }

  getToken():string|null{
    return localStorage.getItem(this.tokenkey);
  }

  saveToken(token: string){
    localStorage.setItem(this.tokenkey, token);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded); // In toàn bộ payload token để kiểm tra
      return decoded?.role || null; // Trả về role nếu có
    } catch (error) {
      console.error('Lỗi giải mã token:', error);
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
    localStorage.removeItem(this.tokenkey);
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
