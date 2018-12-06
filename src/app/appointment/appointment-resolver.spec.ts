import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { Appointment } from 'src/app/appointment';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment-resolver';
import * as moment from 'moment';

const appointment: Appointment = {
  id: '1',
  patientId: '1',
  firstName: 'Yasmin',
  lastName: 'Apt',
  startTime: moment('2018-08-06T18:00:00Z'),
  duration: 20
};

describe('PatientResolver', () => {
  let appointmentService: AppointmentService;
  let resolver: AppointmentResolver;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentResolver,
        { provide: AppointmentService, useValue: { getAppointment: () => of(appointment) } },
        { provide: ActivatedRouteSnapshot, useValue: { params: { id: appointment.id}} }
      ]
    });

    appointmentService = TestBed.get(AppointmentService);
    resolver = TestBed.get(AppointmentResolver);
    route = TestBed.get(ActivatedRouteSnapshot);
    spyOn(appointmentService, 'getAppointment').and.callThrough();
  });

  it('resolves to an appointment object', () => {
    resolver.resolve(route).subscribe(resolvedPatient => {
      expect(appointmentService.getAppointment).toHaveBeenCalledWith(appointment.id);
      expect(resolvedPatient).toEqual(appointment);
    });
  });
});
