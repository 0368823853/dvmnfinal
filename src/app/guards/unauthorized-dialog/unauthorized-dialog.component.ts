import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-dialog',
  standalone: false,
  templateUrl: './unauthorized-dialog.component.html',
  styleUrl: './unauthorized-dialog.component.css'
})
export class UnauthorizedDialogComponent {
  constructor(private dialogRef: MatDialogRef<UnauthorizedDialogComponent>, private router: Router) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
