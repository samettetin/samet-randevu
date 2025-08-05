import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {
  doctors: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const users = this.userService.getUsers();
    this.doctors = users.filter(u => u.role === 'provider');
  }
}
