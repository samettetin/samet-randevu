import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AppointmentService } from '../../services/appointment.service';
import { User } from '../../models/user.model';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss']
})
export class ProviderDetailComponent implements OnInit {
  provider: User | undefined;
  timeSlots: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];
  selectedDate: string = '';
  selectedTime: string = '';
  note: string = '';
  currentUser: User | null = null;
  successMsg: string = '';
  errorMsg: string = '';
  today: string = '';
  defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const providerId = Number(this.route.snapshot.paramMap.get('id'));
    this.provider = this.userService.findUserById(providerId);

    const userStr = sessionStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
    // Bugünün tarihini "yyyy-MM-dd" formatında al
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }

  isSlotAvailable(slot: string): boolean {
    if (!this.selectedDate || !this.provider) return true;
    // O gün o saatte başka randevu var mı?
    const apps = this.appointmentService.getAppointments().filter(a =>
      a.providerId === this.provider!.id &&
      a.date === this.selectedDate &&
      a.time === slot &&
      a.status !== 'rejected'
    );
    return apps.length === 0;
  }

  onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (!this.selectedDate || !this.selectedTime) {
      this.errorMsg = 'Tarih ve saat seçmelisiniz!';
      return;
    }
    if (!this.isSlotAvailable(this.selectedTime)) {
      this.errorMsg = 'Bu saat dolu!';
      return;
    }

    const newApp: Appointment = {
      id: Date.now(), // unique id
      providerId: this.provider!.id,
      customerId: this.currentUser!.id,
      date: this.selectedDate,
      time: this.selectedTime,
      status: 'pending',
      notes: this.note
    };

    this.appointmentService.addAppointment(newApp);
    this.successMsg = 'Randevu talebiniz iletildi!';
    // Formu sıfırla
    this.selectedTime = '';
    this.note = '';
  }
}
