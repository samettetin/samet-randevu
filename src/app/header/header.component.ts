import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get currentRole(): string | null {
    const user = this.authService.getCurrentUser();
    return user?.role || null;
  }

  logout() {
    Swal.fire({
      title: 'Çıkış Yapmak Üzeresiniz',
      text: "MDRS'den çıkış yapmayı onaylıyor musunuz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, çıkış yap',
      cancelButtonText: 'Hayır',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
        Swal.fire({
          title: 'Çıkış Yapıldı',
          text: 'Başarıyla çıkış yaptınız.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  handleBookAppointment(event: Event) {
    event.preventDefault();
    Swal.fire({
      icon: 'info',
      title: 'Randevu Almak İçin Giriş Yapınız',
      text: 'Lütfen önce giriş yapın veya kayıt olun.',
      confirmButtonText: 'Tamam'
    });
  }
}
