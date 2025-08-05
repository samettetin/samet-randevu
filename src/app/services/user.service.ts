import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';

  constructor() {
    if (this.getUsers().length === 0) {
      this.saveUsers([
        {
          id: 1,
          username: 'draysu',
          password: '12345',
          tc: '11111111111',
          role: 'provider',
          fullname: 'Dr. Aysu Aydın',
          specialty: 'Kardiyoloji',
          hospital: 'İstanbul Şehir Hastanesi',
          avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
          birthDate: '1990-08-12',
          bloodType: 'A+',
          gender: 'female',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          username: 'dralp',
          password: '12345',
          tc: '22222222222',
          role: 'provider',
          fullname: 'Dr. Alp Kaan',
          specialty: 'Nöroloji',
          hospital: 'Ankara Eğitim ve Araştırma',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
          birthDate: '1987-11-04',
          bloodType: 'O-',
          gender: 'male',
          createdAt: new Date().toISOString()
        },
        // Diğer doktor ve hastalar da benzer şekilde, createdAt ekleyerek...
        {
          id: 6,
          username: 'samettin',
          password: '12345',
          tc: '66666666666',
          role: 'customer',
          fullname: 'Samettin Yavuz',
          avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
          birthDate: '1994-03-12',
          bloodType: 'B+',
          gender: 'male',
          createdAt: new Date().toISOString()
        },
        {
          id: 100,
          username: 'admin',
          password: 'admin123',
          tc: '99999999999',
          role: 'admin',
          fullname: 'Sistem Yöneticisi',
          gender: 'male',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }

  getUsers(): User[] {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  addUser(user: User) {
    const users = this.getUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    user.id = newId;
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(updatedUser: User) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx > -1) {
      users[idx] = updatedUser;
      this.saveUsers(users);
    }
  }

  findUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username === username);
  }

  findUserById(id: number): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  login(username: string, password: string): User | undefined {
    return this.getUsers().find(u => u.username === username && u.password === password);
  }
}
