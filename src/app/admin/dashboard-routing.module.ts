import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './dashboard.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { MyDeviceComponent } from './my-device/my-device.component';
import { AdminAssignmentComponent } from './admin-assignment/admin-assignment.component';
import { AuthGuard } from '../guards/auth.guard';
import { AppConstants } from '../models/app-constants';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MyLeaveComponent } from './user/my-leave/my-leave.component';
import { AdminLeaveComponent } from './admin-leave/admin-leave.component';
import { MyAttendanceComponent } from './user/my-attendance/my-attendance.component';
import { AdminAttendanceComponent } from './admin-attendance/admin-attendance.component';
import { MySalaryComponent } from './user/my-salary/my-salary.component';
import { AdminSalaryComponent } from './admin-salary/admin-salary.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children:[
      {path: 'dashboard', component: AdminDashboardComponent, canActivate:[AuthGuard]},
      {path: 'devices', component: DeviceListComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'device-form', component: DeviceFormComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'device-form/update/:id', component: DeviceFormComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'user-management', component: UserListComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'user-form/user/:id', component:UserFormComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'my-device', component:MyDeviceComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_USER}},
      {path: 'admin-assignment', component: AdminAssignmentComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'my-leave', component: MyLeaveComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_USER}},
      {path: 'admin-leave', component: AdminLeaveComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'my-attendance', component: MyAttendanceComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_USER}},
      {path: 'admin-attendance', component: AdminAttendanceComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
      {path: 'my-salary', component: MySalaryComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_USER}},
      {path: 'admin-salary', component: AdminSalaryComponent, canActivate:[AuthGuard], data:{role: AppConstants.ROLE_ADMIN}},
    ]
   }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
