import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{

  users: User[] = [];
  errorMessage: string='';
  searchText: string='';
  users$ = new BehaviorSubject<User[]>([]);
  selectedRole: string ='';
  roles: string[] = ['ADMIN', 'USER'];


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ){}

  ngOnInit(): void {
      this.loadUser(); 
  }

  applySearch() {
    const searchText = this.searchText.trim().toLowerCase();
  
    if (!searchText) {
      this.users$.next(this.users); // Nếu không có từ khóa, hiển thị tất cả
    } else {
      const filtered = this.users.filter(user =>
        user.fullname.toLowerCase().includes(searchText) ||
        user.username.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText)
      );
  
      this.users$.next(filtered);
    }
  }
  

  loadUser(){
    this.userService.getUser().subscribe({
      next: (data) => {
        this.users = data; // Lưu danh sách gốc
        this.applySearch(); // Áp dụng tìm kiếm nếu có searchText
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  searchName() {
    this.userService.searchUser(this.searchText).subscribe({
      next: (data) => {
        this.users = data;
        this.users$.next(data);
        console.log('search:', this.users);
  
        // Cập nhật query params trên URL
        this.router.navigate([], {
          queryParams: { searchText: this.searchText },
          queryParamsHandling: 'merge'
        });
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
        this.errorMessage = 'Không thể tìm kiếm user!';
      }
    });
  }
  selectUser(user: User){
    const dialogRef = this.dialog.open(UserFormComponent,{
      width: '400px',
      data: {user}
    })
    dialogRef.afterClosed().subscribe((result)=>{
      if(result==='success'){
        this.loadUser();
      }
    });
  }

  confirmDelete(id: string) {
    const userToDelete = this.users.find(user => user.id === id); // Tìm user theo ID
    
    if (!userToDelete) {
      alert('Lỗi: Không tìm thấy user để xóa!');
      return;
    }
  
    if (userToDelete.role === 'ADMIN') {
      alert('Không thể xóa ADMIN!');
      return;
    }
  
    if (confirm('Bạn có chắc chắn muốn xóa user này không?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('Delete User Successfull!');
          this.loadUser();
        },
        error: (err) => {
          this.authService.handleUnauthorizadError(err);
          console.error('Error delete User', err);
          alert('Xóa user thất bại!');
        }
      });
    }
  }

  filterUserByRole(){
    if(!this.selectedRole){
      this.users$.next(this.users);
      return;
    }
    this.userService.filterRole(this.selectedRole).subscribe(
      (filterUser)=>{
        this.users$.next(filterUser);
      }
    )
  }
  

}
