import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { AuthService } from '../../service/auth.service';
import { CellAction } from '../shared-table/shared-table.component';
import { AppConstants } from '../../models/app-constants';
import { RegisterComponent } from '../../auth/register/register.component';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  errorMessage: string = '';
  searchText: string = '';
  users$ = new BehaviorSubject<User[]>([]);
  selectedRole: string = '';
  // TODO: HoanNTh: Use constants
  roles: string[] = ['All',AppConstants.ROLES.ADMIN, AppConstants.ROLES.USER];

  columns = ['username', 'role', 'fullname', 'email', 'createdAt'];
  config: Array<CellAction>;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.config = [
      {
        name: 'Edit',
        icon: 'edit',
        onAction: (user: User) => this.selectUser(user)
      },
      {
        name: 'Delete',
        icon: 'delete',
        onAction: (user: User) => this.confirmDelete(user.id)
      }
    ];
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUser(this.searchText).subscribe({
      next: (data) => {
        this.users = data; // Store the original list
        this.users$.next(this.users);
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  addUser(user?: User){
    this.showUnauthorizedDialog();
    return false;
  }

  private showUnauthorizedDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
      disableClose: true, // Bắt buộc user phải thao tác trên dialog
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([]);
      this.loadUsers();
    });
  }

  searchByName() {
    if (!this.searchText.trim()) { 
      alert('Please enter a valid search term!'); // Hiển thị thông báo nếu chỉ nhập dấu space
      return;
    }   
    this.userService.searchUser(this.searchText).subscribe({
      next: (data) => {
        this.users = data;
        this.users$.next(data);

        // Update query params in the URL
        this.router.navigate([], {
          queryParams: { searchText: this.searchText },
          queryParamsHandling: 'merge'
        });
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
        this.errorMessage = 'Unable to search for users!';
      }
    });
  }

  selectUser(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadUsers();
      }
    });
  }

  confirmDelete(id: string) {
    const userToDelete = this.users.find(user => user.id === id); // Find user by ID

    if (!userToDelete) {
      alert('Error: User not found for deletion!');
      return;
    }

    if (userToDelete.role === 'ADMIN') {
      alert('Cannot delete an ADMIN!');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          this.authService.handleUnauthorizadError(err);
          alert('Failed to delete user!');
        }
      });
    }
  }

  filterUsersByRole() {
    if (this.selectedRole === 'All') {
      this.users$.next(this.users);
      return;
    }
    this.userService.filterRole(this.selectedRole).subscribe(
      (filteredUsers) => {
        this.users$.next(filteredUsers);
      }
    );
  }
}
