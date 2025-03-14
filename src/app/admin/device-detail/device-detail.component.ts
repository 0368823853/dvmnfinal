import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Device } from '../../models/device.model';

@Component({
  selector: 'app-device-detail',
  standalone: false,
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css'
})
export class DeviceDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<DeviceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string, entity: any }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj).filter(key => !['id', 'iduser', 'iddevice'].includes(key));
  }
  
  
}
