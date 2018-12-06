import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Appointment } from './appointment.model';
import { MOMENT_TOKEN } from '../shared/moment.service';

@Injectable()
export class ScheduleService {
  private tz: string;

  constructor(private http: HttpClient, @Inject(MOMENT_TOKEN) private moment: any) {
    this.tz = moment.tz.guess();
  }

  getSchedule(date: string) {
    return this.http.get('/api/appointments/' + date + '?tz=' + this.tz)
      .pipe(map(response => <Appointment[]>response['appointments']));
  }

  delete(appointment: Appointment) {
    return this.http.delete<null>('/api/appointments/' + appointment.id)
      .toPromise<null>();
  }
}
