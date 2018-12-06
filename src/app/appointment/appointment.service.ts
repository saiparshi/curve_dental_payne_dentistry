import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment } from './appointment.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOMENT_TOKEN } from '../shared/moment.service';

@Injectable()
export class AppointmentService {
  constructor(private http: HttpClient, @Inject(MOMENT_TOKEN) private moment: any) { }

  getAppointment(id: string): Observable<Appointment> {
    return this.http
      .get<Appointment>('/api/appointments/' + id)
      .pipe(map(result => this.mapFromHttp(result)));
  }

  saveAppointment(appointment: Appointment): Observable<Appointment> {
    if (appointment.id) {
      return this.http
        .put<Appointment>(`/api/appointments/${appointment.id}`, this.mapToHttp(appointment))
        .pipe(map(result => this.mapFromHttp(result)));
    } else {
      return this.http
        .post<Appointment>('/api/appointments', this.mapToHttp(appointment))
        .pipe(map(result => this.mapFromHttp(result)));
    }
  }

  private mapFromHttp(appointment: any): Appointment {
    return {
      id: appointment.id,
      patientId: appointment.patientId,
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      startTime: this.moment(appointment.startTime),
      duration: appointment.duration
    };
  }

  private mapToHttp(appointment: Appointment): any {
    const output = {
      id: appointment.id || undefined,
      patientId: appointment.patientId,
      startTime: appointment.startTime.utc().format('YYYY-MM-DDTHH:mm:ss\\Z'),
      duration: appointment.duration
    };
    if (!appointment.id) {
      delete output.id;
    }
    return output;
  }
}
