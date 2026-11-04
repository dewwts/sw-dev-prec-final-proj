interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  serviceFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ServiceJson {
  success: boolean;
  count: number;
  data: ServiceItem[];
}

interface AppointmentUser {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: string;
}

interface AppointmentItem {
  _id: string;
  service: ServiceItem | null;
  user: AppointmentUser;
  registrationNumber: string;
  brand: string;
  model: string;
  appointmentDate: string;
  startTime: string;
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentJson {
  success: boolean;
  count: number;
  data: AppointmentItem[];
}

interface ServiceInput {
  name: string;
  description: string;
  estimatedDuration: number;
  serviceFee: number;
}

interface AppointmentInput {
  service: string;
  registrationNumber: string;
  brand: string;
  model: string;
  appointmentDate: string; // YYYY-MM-DD (UTC)
  startTime: string; // HH:mm (UTC)
}

interface RegisterInput {
  name: string;
  email: string;
  tel: string;
  role: "member" | "admin";
  password: string;
}
