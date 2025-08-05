import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { UserService } from '../../services/user.service';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  customer: User | null = null;
  myAppointments: any[] = [];
  hasUpcomingAppointment: boolean = false;  // <<< Yeni değişken

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    this.customer = userStr ? JSON.parse(userStr) : null;
    if (this.customer) {
      this.loadAppointments();
    }
  }

  loadAppointments() {
    if (!this.customer) return;

    const appts = this.appointmentService.getAppointmentsByCustomer(this.customer.id);

    this.myAppointments = appts.map(app => {
      const providerIdNum = Number(app.providerId); // String ise number'a çevir
      const doctor = this.userService.findUserById(providerIdNum);
      const patient = this.customer;

      return {
        ...app,
        doctorFullname: doctor?.fullname?.trim() || doctor?.username || 'Doktor Bilinmiyor',
        doctorAvatar: doctor?.avatar || this.getAvatarByGender(doctor?.gender),
        gender: doctor?.gender || '',
        specialty: doctor?.specialty || 'Branş Bilgisi Yok',
        hospital: doctor?.hospital || 'Hastane Bilgisi Yok',
        patientFullname: patient!.fullname || patient!.username || 'Sen'
      };
    });

    // Randevulardan 1 gün veya daha az kalan var mı kontrolü
    this.hasUpcomingAppointment = appts.some(app => {
      const appointmentDate = new Date(app.date);
      const today = new Date();
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1 && diffDays >= 0 && app.status === 'approved';  // Onaylanmış ve 1 gün veya daha az kalan
    });
  }

  getAvatarByGender(gender: string | undefined): string {
    if (gender === 'female') {
      return 'assets/default-avatar-pink.png';
    } else if (gender === 'male') {
      return 'assets/default-avatar-blue.png';
    } else {
      return 'assets/default-avatar-neutral.png';
    }
  }

  cancel(app: Appointment) {
    app.status = 'canceled';
    this.appointmentService.updateAppointment(app);
    this.loadAppointments();
  }
}
