import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.model';
import * as moment from 'moment';
import { MOMENT_TOKEN } from '../shared/moment.service';

const appointment: Appointment = {
    id: '1',
    patientId: '2',
    firstName: 'Yasmin',
    lastName: 'Apt',
    startTime: moment('2018-08-06T18:00:00Z'),
    duration: 30
  };

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AppointmentService, { provide: MOMENT_TOKEN, useValue: moment } ],
      imports: [ HttpClientTestingModule ]
    });

    appointmentService = TestBed.get(AppointmentService);
    httpTestingController = TestBed.get(HttpTestingController);
    jasmine.addCustomEqualityTester(appointmentEquals);
  });

  it('returns a single appointment', () => {
    appointmentService.getAppointment('1').subscribe(returnedAppointment => {
      expect(returnedAppointment).toEqual(appointment);
    });

    const req = httpTestingController.expectOne('/api/appointments/1');
    expect(req.request.method).toBe('GET');
    req.flush({
      id: '1',
      patientId: '2',
      firstName: 'Yasmin',
      lastName: 'Apt',
      startTime: '2018-08-06T18:00:00Z',
      duration: 30
    });

    httpTestingController.verify();
  });

  it('creates a appointment and returns the object with the id set', () => {
    const newAppointment: Appointment = {
      id: null,
      patientId: '2',
      startTime: moment('2018-08-06T18:00:00Z'),
      duration: 30
    };
    const createdAppointment: Appointment = {
      id: '2',
      patientId: '2',
      firstName: 'Yasmin',
      lastName: 'Apt',
      startTime: moment('2018-08-06T18:00:00Z'),
      duration: 30
    };

    appointmentService.saveAppointment(newAppointment).subscribe(returnedAppointment => {
      expect(returnedAppointment).toEqual(createdAppointment);
    });

    const req = httpTestingController.expectOne('/api/appointments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ patientId: '2', startTime: '2018-08-06T18:00:00Z', duration: 30 });
    req.flush({
      id: '2',
      patientId: '2',
      firstName: 'Yasmin',
      lastName: 'Apt',
      startTime: '2018-08-06T18:00:00Z',
      duration: 30
    });

    httpTestingController.verify();
  });

  it('updates a appointment and returns the object', () => {
    const existingAppointment: Appointment = {
      id: '2',
      patientId: '2',
      startTime: moment('2018-08-06T18:00:00Z'),
      duration: 30
    };
    const updatedAppointment: Appointment = {
      id: '2',
      patientId: '2',
      firstName: 'Yasmin',
      lastName: 'Apt',
      startTime: moment('2018-08-06T18:00:00Z'),
      duration: 30
    };

    appointmentService.saveAppointment(existingAppointment).subscribe(returnedAppointment => {
      expect(returnedAppointment).toEqual(updatedAppointment);
    });

    const req = httpTestingController.expectOne('/api/appointments/2');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ id: '2', patientId: '2', startTime: '2018-08-06T18:00:00Z', duration: 30 });
    req.flush({
      id: '2',
      patientId: '2',
      firstName: 'Yasmin',
      lastName: 'Apt',
      startTime: '2018-08-06T18:00:00Z',
      duration: 30
    });

    httpTestingController.verify();
  });
});

function appointmentEquals(first, second) {
  if (first.startTime && moment.isMoment(first.startTime) &&
      second.startTime && moment.isMoment(second.startTime)) {
    return first.id === second.id &&
           first.patientId === second.patientId &&
           moment.isMoment(first.startTime) &&
           moment.isMoment(second.startTime) &&
           first.startTime.toISOString() === second.startTime.toISOString() &&
           first.duration === second.duration;
  }
}
