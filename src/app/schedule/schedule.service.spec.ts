import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ScheduleService } from './schedule.service';
import { Appointment } from './appointment.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import * as moment from 'moment-timezone';

const appointment: Appointment = {
  id: '1',
  patientId: '1',
  firstName: 'Yasmin',
  lastName: 'Apt',
  startTime: '2018-07-12T16:00:00Z',
  duration: 30
};

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ScheduleService, { provide: MOMENT_TOKEN, useValue: moment } ],
      imports: [ HttpClientTestingModule ]
    });

    spyOn(moment.tz, 'guess').and.returnValue('America/Edmonton');
    scheduleService = TestBed.get(ScheduleService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('returns a schedule for a date', () => {
    scheduleService.getSchedule('2018-07-12').subscribe(appointments => {
      expect(appointments).toEqual([appointment]);
    });

    const req = httpTestingController.expectOne('/api/appointments/2018-07-12?tz=America/Edmonton');
    expect(req.request.method).toBe('GET');
    req.flush({ appointments: [appointment] });

    httpTestingController.verify();
  });

  it('deletes an appointment by its id', (done) => {
    scheduleService.delete(appointment).then(() => {
      done();
    });

    const req = httpTestingController.expectOne('/api/appointments/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    httpTestingController.verify();
  });
});
