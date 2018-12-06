import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Appointment } from './appointment.model';
import { AppointmentService } from './appointment.service';
import { Observable } from 'rxjs';

@Injectable()
export class AppointmentResolver implements Resolve<Appointment> {
  constructor(private appointmentService: AppointmentService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Appointment> {
    return this.appointmentService.getAppointment(route.params['id']);
  }
}
