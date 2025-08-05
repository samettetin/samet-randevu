export interface User {
  id: number;
  username: string;
  password: string;
  tc: string;
  role: 'provider' | 'customer' | 'admin';
  fullname?: string;
  specialty?: string;
  hospital?: string;
  avatar?: string;
  birthDate?: string;
  bloodType?: string;
  createdAt?: string; // kayıt tarihini tutmak için
  gender?: 'male' | 'female';
}
