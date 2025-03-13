import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from '@angular/forms';
import { UnauthorizedDialogComponent } from './guards/unauthorized-dialog/unauthorized-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule, MatInputModule, MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
