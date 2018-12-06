import { ScheduleDayComponent } from './schedule-day.component';
import { of } from 'rxjs';
import { Appointment } from './appointment.model';
import * as moment from 'moment';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';

describe('ScheduleDayComponent', () => {
  let component: ScheduleDayComponent;
  let mockScheduleService;
  let activatedRoute;

  const today = moment('2018-05-01');
  const appointment: Appointment = {
    id: '1',
    patientId: '1',
    firstName: 'Barb',
    lastName: 'Jones',
    startTime: today.add(8, 'hours').toISOString(),
    duration: 30
  };

  beforeEach(() => {
    jasmine.clock().mockDate(today.toDate());
  });

  it('should create the component', () => {
    component = new ScheduleDayComponent(mockScheduleService, moment, activatedRoute);

    expect(component).toBeTruthy();
  });

  it('should retrieve today\'s schedule when date param not present', () => {
    activatedRoute = { snapshot: { params: {} }, params: of({}) };
    mockScheduleService = jasmine.createSpyObj('mockScheduleService', ['getSchedule']);
    mockScheduleService.getSchedule.and.returnValue(of(<Appointment[]>[appointment]));

    component = new ScheduleDayComponent(mockScheduleService, moment, activatedRoute);
    component.ngOnInit();

    expect(component.appointments).toEqual([appointment]);
    expect(mockScheduleService.getSchedule).toHaveBeenCalledWith(today.format('YYYY-MM-DD'));
  });

  it('should retrieve today\'s schedule when date param is invalid', () => {
    activatedRoute = { snapshot: { params: { date: '2018-03-32'} }, params: of({ date: '2018-03-32'}) };
    mockScheduleService = jasmine.createSpyObj('mockScheduleService', ['getSchedule']);
    mockScheduleService.getSchedule.and.returnValue(of(<Appointment[]>[appointment]));

    component = new ScheduleDayComponent(mockScheduleService, moment, activatedRoute);
    component.ngOnInit();

    expect(component.appointments).toEqual([appointment]);
    expect(mockScheduleService.getSchedule).toHaveBeenCalledWith(today.format('YYYY-MM-DD'));
  });

  it('should retrieve schedule from route param', () => {
    activatedRoute = { snapshot: { params: {} }, params: of({ date: '2018-03-27' }) };
    mockScheduleService = jasmine.createSpyObj('mockScheduleService', ['getSchedule']);
    mockScheduleService.getSchedule.and.returnValue(of(<Appointment[]>[appointment]));

    component = new ScheduleDayComponent(mockScheduleService, moment, activatedRoute);
    component.ngOnInit();

    expect(component.appointments).toEqual([appointment]);
    expect(mockScheduleService.getSchedule).toHaveBeenCalledWith('2018-03-27');
  });

  it('should delete appointment and then update', fakeAsync(() => {
    activatedRoute = { snapshot: { params: {} }, params: of({}) };
    mockScheduleService = jasmine.createSpyObj('mockScheduleService', ['getSchedule', 'delete']);
    mockScheduleService.delete.and.returnValue(Promise.resolve());
    mockScheduleService.getSchedule.and.returnValue(of(<Appointment[]>[]));

    component = new ScheduleDayComponent(mockScheduleService, moment, activatedRoute);
    component.date = today;
    component.deleteAppointment(appointment);

    expect(mockScheduleService.delete).toHaveBeenCalledWith(appointment);
    expect(mockScheduleService.getSchedule).not.toHaveBeenCalled();
    flushMicrotasks();
    expect(mockScheduleService.getSchedule).toHaveBeenCalledWith(today.format('YYYY-MM-DD'));
    expect(component.appointments).toEqual([]);
  }));
});
