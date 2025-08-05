import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  tc = ''; // <-- yeni alan
  role: 'customer' = 'customer';
  avatar = '';
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  randomAvatar() {
    const rand = Math.floor(Math.random() * 70);
    this.avatar = `https://randomuser.me/api/portraits/men/${rand}.jpg`;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.password || !this.tc) {
      this.errorMessage = 'Tüm alanlar zorunlu!';
      return;
    }
    if (!/^[0-9]{11}$/.test(this.tc)) {
      this.errorMessage = 'Geçerli bir TC Kimlik Numarası giriniz!';
      return;
    }
    if (this.userService.findUserByUsername(this.username)) {
      this.errorMessage = 'Bu kullanıcı adı zaten kayıtlı!';
      return;
    }
    const newUser: User = {
      id: 0,
      username: this.username,
      password: this.password,
      tc: this.tc,
      role: 'customer',
      avatar: this.avatar || undefined,
      createdAt: new Date().toISOString() // <-- KAYIT TARİHİ EKLENDİ!
    };
    this.userService.addUser(newUser);
    this.successMessage = 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.';

    setTimeout(() => this.router.navigate(['/login']), 1500);
  }
}
