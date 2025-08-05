import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppointmentService } from '../../services/appointment.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {
  hospitals: string[] = [];
  specialties: string[] = [];
  doctors: User[] = [];

  selectedHospital = '';
  selectedSpecialty = '';
  selectedDoctorId: number | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  availableTimes: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
  successMsg = '';
  errorMsg = '';
  currentUser: User | null = null;
  minDate: string = '';

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;

    const users = this.userService.getUsers().filter(u => u.role === 'provider');
    this.hospitals = Array.from(new Set(users.map(u => u.hospital || '').filter(h => h)));

    // Branşlar başta boş, hastane seçince güncellenecek
    this.specialties = [];

    const today = new Date();
    this.minDate = today.toISOString().slice(0, 10);
  }

  selectHospital(hospital: string) {
    this.selectedHospital = hospital;
    this.selectedSpecialty = '';
    this.selectedDoctorId = null;

    // Bu hastanedeki doktorların branşlarını getir
    const doctorsInHospital = this.userService.getUsers()
      .filter(u => u.role === 'provider' && u.hospital === hospital);

    this.specialties = Array.from(new Set(doctorsInHospital.map(d => d.specialty || '').filter(s => s)));
    this.doctors = [];
  }

  selectSpecialty(specialty: string) {
    this.selectedSpecialty = specialty;
    this.selectedDoctorId = null;

    // Bu hastane ve branştaki doktorları getir
    this.doctors = this.userService.getUsers()
      .filter(u => u.role === 'provider' && u.hospital === this.selectedHospital && u.specialty === specialty);
  }

  bookAppointment() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.selectedHospital || !this.selectedSpecialty || !this.selectedDoctorId || !this.selectedDate || !this.selectedTime) {
      this.errorMsg = 'Lütfen tüm alanları doldurun.';
      return;
    }

    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
    if (!this.currentUser) {
      this.errorMsg = 'Lütfen giriş yapınız.';
      return;
    }

    if (this.selectedDate < this.minDate) {
      this.errorMsg = 'Geçmiş bir tarihe randevu alınamaz!';
      return;
    }

    const appointments = this.appointmentService.getAppointments();

    const isDoctorBusy = appointments.some(app =>
      app.providerId === this.selectedDoctorId &&
      app.date === this.selectedDate &&
      app.time === this.selectedTime &&
      app.status !== 'canceled'
    );
    if (isDoctorBusy) {
      this.errorMsg = 'Seçtiğiniz doktorun bu saatte başka bir randevusu var!';
      return;
    }

    const isUserConflicting = appointments.some(app =>
      app.customerId === this.currentUser!.id &&
      app.date === this.selectedDate &&
      app.time === this.selectedTime &&
      app.status !== 'canceled'
    );
    if (isUserConflicting) {
      this.errorMsg = 'Bu tarih ve saatte zaten bir randevunuz var!';
      return;
    }

    this.appointmentService.addAppointment({
      id: 0,
      providerId: this.selectedDoctorId!,
      customerId: this.currentUser.id,
      date: this.selectedDate,
      time: this.selectedTime,
      status: 'pending'
    });

    this.successMsg = 'Randevunuz kaydedildi! Onay için bekleniyor.';
    this.selectedHospital = '';
    this.selectedSpecialty = '';
    this.selectedDoctorId = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.specialties = [];
    this.doctors = [];
  }
}
