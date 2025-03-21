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
    return Object.keys(obj).filter(key => !['id', 'iduser', 'iddevice', 'userId'].includes(key));
  }
  
  formatKey(key: string): string {
    const keyMap: { [key: string]: string } = {
      createdat: 'Creation Date',
      devicestatus: 'Device Status'
    };
    return keyMap[key.toLowerCase()] || this.capitalizeWords(key);
  }
    private capitalizeWords(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Tách camelCase
      .replace(/_/g, ' ') // Thay thế dấu gạch dưới bằng khoảng trắng
      .replace(/\b\w/g, char => char.toUpperCase()); // Viết hoa chữ cái đầu
  }
}
