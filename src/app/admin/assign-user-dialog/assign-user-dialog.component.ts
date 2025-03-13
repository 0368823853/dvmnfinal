import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-assign-user-dialog',
  standalone: false,
  templateUrl: './assign-user-dialog.component.html',
  styleUrl: './assign-user-dialog.component.css'
})
export class AssignUserDialogComponent implements OnInit{
  users: any[] = [];
  selectedUserId: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUser().subscribe(users => {
      this.users = users;
    });
  }
  confirmSelection() {
    if (!this.selectedUserId) {
      alert('Please choose user');
      return;
    }
    this.dialogRef.close(this.selectedUserId);
  }

}
