import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProviderDetailComponent } from './pages/provider-detail/provider-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyAppointmentsComponent } from './pages/my-appointments/my-appointments.component';
import { ProviderPanelComponent } from './pages/provider-panel/provider-panel.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';

// ADMIN için yeni eklenen component'ler
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'book-appointment', component: BookAppointmentComponent, canActivate: [AuthGuard] },
  { path: 'provider/:id', component: ProviderDetailComponent, canActivate: [AuthGuard] },
  { path: 'my-appointments', component: MyAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'provider-panel', component: ProviderPanelComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // ADMIN Route'ları:
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
  { path: 'doctors', component: DoctorsComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
