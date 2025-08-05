import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: any = null;
  defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';
  notificationCount = 0;
  notifications: any[] = [];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.refreshUser();
    this.checkNotifications();
    window.addEventListener('storage', () => {
      this.refreshUser();
      this.checkNotifications();
    });
  }

  refreshUser() {
    const userStr = sessionStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
  }

  logout() {
    if (confirm("MDRS'den çıkmak istediğinize emin misiniz?")) {
      sessionStorage.removeItem('currentUser');
      this.refreshUser();
      this.router.navigate(['/login']);
    }
  }

  // --- BİLDİRİMLER ---
  checkNotifications() {
    if (!this.currentUser) {
      this.notificationCount = 0;
      this.notifications = [];
      return;
    }
    // Sadece müşteri için çalışır; doktor paneli için istersen ekleriz
    const now = new Date();
    const nextDay = new Date();
    nextDay.setDate(now.getDate() + 1);

    const all = this.appointmentService.getAppointmentsByCustomer(this.currentUser.id);
    // Sadece bir gün kalan ve onaylanmış randevular için
    this.notifications = all.filter(app => {
      if (app.status !== 'approved') return false;
      const appDate = new Date(app.date);
      return (
        appDate.getFullYear() === nextDay.getFullYear() &&
        appDate.getMonth() === nextDay.getMonth() &&
        appDate.getDate() === nextDay.getDate()
      );
    });
    this.notificationCount = this.notifications.length;
  }

  showNotifications() {
    // Basit alert ile gösterelim; istersen özel modal yapabiliriz
    if (this.notificationCount === 0) return;
    let msg = 'Yaklaşan randevularınız:\n\n';
    this.notifications.forEach(app => {
      msg += `• ${app.date} ${app.time} - ${app.specialty || ''} (${app.hospital || ''})\n`;
    });
    alert(msg);
  }
}
