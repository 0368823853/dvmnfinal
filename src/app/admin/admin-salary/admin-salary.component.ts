import { Component, OnInit } from '@angular/core';
import { SalaryService } from '../../service/salary.service';
import { Salary } from '../../models/salary.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin-salary',
  standalone: false,
  templateUrl: './admin-salary.component.html',
  styleUrl: './admin-salary.component.css'
})
export class AdminSalaryComponent implements OnInit{
  userId = ''; // Nhập ID nhân viên
  startDate = '';
  endDate = '';
  calculatedSalary: Salary | null = null; // Kết quả sau khi tính lương
  message = '';
  searchText: string = '';
  salarys: Salary[]=[];
  salarys$ = new BehaviorSubject<Salary[]>([]);
  colums = ['year','month', 'totalHours','totalSalary', 'baseSalary','overtimePay','overtimeHours', 'userName'];

  constructor(private salaryService: SalaryService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.loadLeave();
  }

// 🧮 Gọi API tính lương
calculateSalary() {
  if (!this.userId || !this.startDate || !this.endDate) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  this.salaryService.calculateSalary(this.userId, this.startDate, this.endDate)
    .subscribe(
      (salary) => { 
        this.calculatedSalary = salary; 
      },
      (error) => { 
        alert('Lỗi khi tính lương: ' + error.message); 
      }
    );
}

// ✅ Gọi API xác nhận & lưu lương
confirmSalary() {
  if (!this.calculatedSalary) {
    alert('Không có dữ liệu lương để xác nhận!');
    return;
  }

  this.salaryService.confirmSalary(this.calculatedSalary)
    .subscribe(
      (res) => {  
        this.message = res; 
        alert('Lương đã được lưu!'); 
      },
      (error) => { 
        alert('Lỗi khi lưu lương: ' + error.message); 
      }
    );
}


  loadLeave(){
    this.salaryService.getAllSalary(this.searchText).subscribe({
      next: (data) =>{
        this.salarys = data;
        this.salarys$.next(this.salarys);
      },
      error: (err)=>{
        this.authService.handleUnauthorizadError(err);
      }
    });
  }
}
