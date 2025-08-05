import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  providers: User[] = [];
  currentUser: User | null = null;
  isAdmin = false;
  defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.providers = this.userService.getUsers().filter(u => u.role === 'provider');
    const userStr = localStorage.getItem('currentUser'); // ← localStorage'a çevrildi
    this.currentUser = userStr ? JSON.parse(userStr) : null;
    this.isAdmin = !!this.currentUser && this.currentUser.role === 'admin'; // ← isAdmin flag'i

    this.providers.forEach(p => {
      if (!p.avatar) {
        p.avatar = this.defaultAvatar;
      }
    });
  }
}
