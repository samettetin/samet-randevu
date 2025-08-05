import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  // Form alanları
  birthDate = '';
  bloodType = '';
  newPassword = '';
  confirmPassword = '';

  successMsg = '';
  errorMsg = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // localStorage üzerinden kullanıcıyı çekiyoruz
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;

    // Kullanıcı yoksa login'e yönlendir
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Kullanıcıdan profil bilgilerini doldur
    this.birthDate = this.currentUser.birthDate || '';
    this.bloodType = this.currentUser.bloodType || '';
  }

  saveProfile() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.currentUser) return;

    // Formdan güncel değerleri kullanıcıya aktar
    this.currentUser.birthDate = this.birthDate;
    this.currentUser.bloodType = this.bloodType;

    // UserService ile güncelle
    this.userService.updateUser(this.currentUser);
    // localStorage’da güncel tut
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.successMsg = "Profil bilgileri başarıyla güncellendi!";
  }

  changePassword() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.currentUser) return;

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMsg = "Şifre alanları zorunlu!";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = "Şifreler eşleşmiyor!";
      return;
    }
    this.currentUser.password = this.newPassword;
    this.userService.updateUser(this.currentUser);
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.successMsg = "Şifre başarıyla değiştirildi!";
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
