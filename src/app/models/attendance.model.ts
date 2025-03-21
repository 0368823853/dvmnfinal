export interface Attendance {
    id: string;
    userId: string;
    checkIn: string;
    checkOut?: string;
    workHours?: number;
    status: string;
    userName: string;
    createdAt: string;
  }