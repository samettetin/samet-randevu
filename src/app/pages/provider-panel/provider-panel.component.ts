import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { UserService } from '../../services/user.service';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-provider-panel',
  templateUrl: './provider-panel.component.html',
  styleUrls: ['./provider-panel.component.scss']
})
export class ProviderPanelComponent implements OnInit {
  provider: User | null = null;
  pendingAppointments: Appointment[] = [];
  otherAppointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userStr = sessionStorage.getItem('currentUser');
    this.provider = userStr ? JSON.parse(userStr) : null;
    if (this.provider) {
      this.loadAppointments();
    }
  }

  loadAppointments() {
    const all = this.appointmentService.getAppointmentsByProvider(this.provider!.id);
    this.pendingAppointments = all.filter(a => a.status === 'pending');
    this.otherAppointments = all.filter(a => a.status !== 'pending');
  }

  getCustomerName(customerId: number): string {
    const user = this.userService.findUserById(customerId);
    return user ? user.username : 'Bilinmiyor';
  }

  approve(app: Appointment) {
    app.status = 'approved';
    this.appointmentService.updateAppointment(app);
    this.loadAppointments();
  }

  reject(app: Appointment) {
    app.status = 'rejected';
    this.appointmentService.updateAppointment(app);
    this.loadAppointments();
  }
}
