import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './dashboard.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { MyDeviceComponent } from './my-device/my-device.component';
import { AdminAssignmentComponent } from './admin-assignment/admin-assignment.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children:[
      {path: 'devices', component: DeviceListComponent},
      {path: 'device-form', component: DeviceFormComponent},
      {path: 'device-form/update/:id', component: DeviceFormComponent},
      {path: 'user-management', component: UserListComponent},
      {path: 'user-form/user/:id', component:UserFormComponent},
      {path: 'my-device', component:MyDeviceComponent},
      {path: 'admin-assignment', component: AdminAssignmentComponent}
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
