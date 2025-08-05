import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private storageKey = 'appointments';

  constructor() {
    if (this.getAppointments().length === 0) {
      this.saveAppointments([
        {
          id: 1,
          providerId: 1,
          customerId: 6,
          date: '2025-07-31',
          time: '13:00',
          status: 'pending'
        }
      ]);
    }
  }

  getAppointments(): Appointment[] {
    const apps = localStorage.getItem(this.storageKey);
    return apps ? JSON.parse(apps) : [];
  }

  saveAppointments(apps: Appointment[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(apps));
  }

  addAppointment(app: Appointment) {
    const apps = this.getAppointments();
    const newId = apps.length > 0 ? Math.max(...apps.map(a => a.id)) + 1 : 1;
    app.id = newId;
    apps.push(app);
    this.saveAppointments(apps);
  }

  updateAppointment(app: Appointment) {
    const apps = this.getAppointments().map(a => a.id === app.id ? app : a);
    this.saveAppointments(apps);
  }

  getAppointmentsByProvider(providerId: number) {
    return this.getAppointments().filter(a => a.providerId === providerId);
  }

  getAppointmentsByCustomer(customerId: number) {
    return this.getAppointments().filter(a => a.customerId === customerId);
  }
}
