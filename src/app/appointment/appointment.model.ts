export interface Appointment {
  id?: string;
  patientId: string;
  firstName?: string;
  lastName?: string;
  startTime: any; // Moment
  duration: number;
}
