import { DeviceListComponent } from './admin/device-list/device-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate:[AuthGuard], data:{role: 'ROLE_ADMIN'} },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate:[AuthGuard] , data:{role: 'ROLE_USER'} },
  // { path: 'devices', component: DeviceListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
