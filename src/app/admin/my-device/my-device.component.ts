import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { DeviceAssignmentService } from '../../service/device-assignment.service';
import { DeviceAssignment } from '../../models/deviceassignment.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CellAction } from '../shared-table/shared-table.component';

@Component({
  selector: 'app-my-device',
  standalone: false,
  templateUrl: './my-device.component.html',
  styleUrl: './my-device.component.css'
})
export class MyDeviceComponent implements OnInit {

  devices: DeviceAssignment[] = [];
  devices$ = new BehaviorSubject<DeviceAssignment[]>([]);
  config: Array<CellAction>;
  columns = ['deviceName', 'deviceStatus', 'createdAt', 'status'];

  constructor(
    private deviceAssignmentService: DeviceAssignmentService,
    private router: Router,
    private authService: AuthService
  ) {
    this.config = [
      {
        name: 'Return',
        icon: 'keyboard_return',
        onAction: (device: DeviceAssignment) => this.unassignDevice(device.id),
        disabled: (device: DeviceAssignment) => device.status === 'Returned'
      }
    ];
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices() {
    this.deviceAssignmentService.getUserDevices().subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (err) => {
        this.authService.handleUnauthorizadError(err);
      }
    });
  }

  unassignDevice(deviceAssignmentId: string) {
    if (confirm("Are you sure you want to return this device?")) {
      this.deviceAssignmentService.unAssignment(deviceAssignmentId).subscribe({
        next: () => {
          alert('Device returned successfully!');
          this.loadDevices();
        },
        error: (err) => {
          this.authService.handleUnauthorizadError(err);
          alert('Device has already been returned and is pending confirmation.');
        }
      });
    }
  }
}
