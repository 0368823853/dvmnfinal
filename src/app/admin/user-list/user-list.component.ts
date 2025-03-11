import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { AuthService } from '../../service/auth.service';
import { CellAction } from '../shared-table/shared-table.component';
import { AppConstants } from '../../models/app-constants';

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
  //TODO: HoanNTh: để hằng số
  roles: string[] = [AppConstants.ROLES.ADMIN, AppConstants.ROLES.USER];

  columns = ['username','role', 'fullname', 'email', 'createdAt'];
  config: Array<CellAction>;


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ){
    this.config = [
      {
        name: 'Edit',
        icon: 'edit',
        onAction: (user: User)=> this.selectUser(user)
      },
      {
        name: 'Delete',
        icon: 'delete',
        onAction: (user: User)=> this.confirmDelete(user.id)
      }
    ]
  }

  ngOnInit(): void {
      this.loadUser();
  }


  loadUser(){
    this.userService.getUser(this.searchText).subscribe({
      next: (data) => {
        this.users = data; // Lưu danh sách gốc
        this.users$.next(this.users)
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  searchName() {
    this.userService.searchUser(this.searchText).subscribe({
      next: (data) => {
        this.users = data;
        this.users$.next(data);

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
          alert('Xóa user thành công!');
          this.loadUser();
        },
        error: (err) => {
          this.authService.handleUnauthorizadError(err);
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
