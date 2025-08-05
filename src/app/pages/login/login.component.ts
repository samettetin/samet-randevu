import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    const user = this.userService.login(this.username, this.password);
    if (!user) {
      this.errorMessage = 'Kullanıcı adı veya şifre hatalı!';
      return;
    }
    this.authService.login(user);

    // Rol bazlı yönlendirme
    if (user.role === 'admin') {
      window.location.href = '/admin-panel';
    } else if (user.role === 'provider') {
      window.location.href = '/provider-panel';
    } else {
      window.location.href = '/my-appointments';
    }
  }
}
