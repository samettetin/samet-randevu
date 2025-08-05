import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'; // <-- EKLE BUNU
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { ProviderDetailComponent } from './pages/provider-detail/provider-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyAppointmentsComponent } from './pages/my-appointments/my-appointments.component';
import { ProviderPanelComponent } from './pages/provider-panel/provider-panel.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';
import { HeaderComponent } from './header/header.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProviderDetailComponent,
    LoginComponent,
    RegisterComponent,
    MyAppointmentsComponent,
    ProviderPanelComponent,
    ProfileComponent,
    BookAppointmentComponent,
    HeaderComponent,
    AdminPanelComponent,
    PatientsComponent,
    DoctorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,           // <-- BURAYA DA EKLE
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
