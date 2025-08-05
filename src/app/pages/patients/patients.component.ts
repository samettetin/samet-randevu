import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const users = this.userService.getUsers();
    this.patients = users.filter(u => u.role === 'customer');
  }
}
