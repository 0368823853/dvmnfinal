import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './dashboard-routing.module';
import { AdminComponent } from './dashboard.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCellDef, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceFormComponent } from './device-form/device-form.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserListComponent } from './user-list/user-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from './user-form/user-form.component';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { MyDeviceComponent } from './my-device/my-device.component';
import { AdminAssignmentComponent } from './admin-assignment/admin-assignment.component';
import { SharedTableComponent } from './shared-table/shared-table.component';
import { AssignUserDialogComponent } from './assign-user-dialog/assign-user-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { MyLeaveComponent } from './user/my-leave/my-leave.component';
import { AdminLeaveComponent } from './admin-leave/admin-leave.component';
import { LeaveDialogComponent } from './user/leave-dialog/leave-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MyAttendanceComponent } from './user/my-attendance/my-attendance.component';
import { AdminAttendanceComponent } from './admin-attendance/admin-attendance.component';
import { MySalaryComponent } from './user/my-salary/my-salary.component';
import { AdminSalaryComponent } from './admin-salary/admin-salary.component';

@NgModule({
  declarations: [
    AdminComponent,
    DeviceListComponent,
    DeviceFormComponent,
    UserListComponent,
    UserFormComponent,
    PasswordChangeComponent,
    MyDeviceComponent,
    AdminAssignmentComponent,
    SharedTableComponent,
    AssignUserDialogComponent,
    DashboardComponent,
    AdminDashboardComponent,
    DeviceDetailComponent,
    MyLeaveComponent,
    AdminLeaveComponent,
    LeaveDialogComponent,
    MyAttendanceComponent,
    AdminAttendanceComponent,
    MySalaryComponent,
    AdminSalaryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatIconButton,
    MatMenuModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class DashboardModule { }
