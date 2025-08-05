export interface Appointment {
  id: number;
  providerId: number;   // kesinlikle number
  customerId: number;   // kesinlikle number
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'canceled';
  notes?: string;
}
