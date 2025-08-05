import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  todayAppointmentCount = 0;
  todayNewPatientCount = 0;
  totalPatientCount = 0;
  totalDoctorCount = 0;

  allPatients: User[] = [];
  allDoctors: User[] = [];

  enrichedPendingAppointments: any[] = [];

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadUserLists();
    this.loadPendingAppointments();
  }

  loadStatistics() {
    const today = new Date().toISOString().slice(0, 10);

    const appointments = this.appointmentService.getAppointments();
    this.todayAppointmentCount = appointments.filter(a => a.date === today).length;

    const users = this.userService.getUsers();
    this.todayNewPatientCount = users.filter(u =>
      u.role === 'customer' && u.createdAt?.slice(0, 10) === today
    ).length;

    this.totalPatientCount = users.filter(u => u.role === 'customer').length;
    this.totalDoctorCount = users.filter(u => u.role === 'provider').length;
  }

  loadUserLists() {
    const users = this.userService.getUsers();
    this.allPatients = users.filter(u => u.role === 'customer');
    this.allDoctors = users.filter(u => u.role === 'provider');
  }

  loadPendingAppointments() {
    const pending = this.appointmentService.getAppointments().filter(app => app.status === 'pending');

    this.enrichedPendingAppointments = pending.map(app => {
      const providerIdNum = Number(app.providerId);
      const customerIdNum = Number(app.customerId);

      const doctor = this.userService.findUserById(providerIdNum);
      const patient = this.userService.findUserById(customerIdNum);

      const isFemale = doctor?.gender === 'female';
      const defaultAvatar = doctor?.avatar
        || (isFemale
          ? 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png'
          : 'https://cdn-icons-png.flaticon.com/512/2922/2922506.png');

      return {
        ...app,
        doctorName: doctor?.fullname?.trim() || doctor?.username || 'Doktor Bilinmiyor',
        patientName: patient?.fullname?.trim() || patient?.username || 'Hasta Bilinmiyor',
        doctorAvatar: defaultAvatar,
        specialty: doctor?.specialty?.trim() || 'Branş Bilgisi Yok',
        hospital: doctor?.hospital?.trim() || 'Hastane Bilgisi Yok',
        gender: doctor?.gender || 'other'
      };
    });
  }

  approveAppointment(app: Appointment) {
    app.status = 'approved';
    this.appointmentService.updateAppointment(app);
    this.loadPendingAppointments();
    this.loadStatistics();
  }

  rejectAppointment(app: Appointment) {
    app.status = 'rejected';
    this.appointmentService.updateAppointment(app);
    this.loadPendingAppointments();
    this.loadStatistics();
  }
}
