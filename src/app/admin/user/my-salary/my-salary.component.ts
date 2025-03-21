import { Component, OnInit } from '@angular/core';
import { SalaryService } from '../../../service/salary.service';
import { Salary } from '../../../models/salary.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-my-salary',
  standalone: false,
  templateUrl: './my-salary.component.html',
  styleUrl: './my-salary.component.css'
})
export class MySalaryComponent implements OnInit{

  userId: string | null = '';
  salarys: Salary[] = [];
  salarys$ = new BehaviorSubject<Salary[]>([]);
  colums = ['year','month', 'totalHours','totalSalary', 'baseSalary','overtimePay','overtimeHours', 'userName'];


  constructor(private salaryService: SalaryService,
    private authService: AuthService
  ) {
    
  }
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser(); 
    if (!currentUser || !currentUser.id) {
      return;
    }
    
    this.userId = currentUser.id; // ✅ Gán đúng ID
    this.loadSalary();
  }

  loadSalary() {
    if (!this.userId) return;
    this.salaryService.getSalaryByUser(this.userId).subscribe({
      next: (data) => {
        this.salarys = data;
        this.salarys$.next(this.salarys);
      },
      error: () => alert('Lỗi khi lấy danh sách nghỉ phép!')
    });
  }

}
