import { ScheduleItemComponent } from './schedule-item.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MOMENT_TOKEN } from '../shared/moment.service';
import * as moment from 'moment-timezone';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Appointment } from './appointment.model';
import { Location } from '@angular/common';

const appointment: Appointment = {
  id: '1',
  patientId: '2',
  firstName: 'Yasmin',
  lastName: 'Apt',
  startTime: moment('2018-08-06T18:00:00Z'),
  duration: 30
};

describe('ScheduleItemComponent', () => {
  let fixture: ComponentFixture<ScheduleItemComponent>;
  let component: ScheduleItemComponent;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleItemComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'appointments/:id/edit', component: Component },
          { path: 'patients/:id', component: Component }
        ]),
        FontAwesomeModule
      ],
      providers: [
        { provide: MOMENT_TOKEN, useValue: moment }
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(ScheduleItemComponent);
    component = fixture.componentInstance;
    component.appointment = appointment;
  });

  it('can create the component', () => {
    expect(component).toBeTruthy();
  });

  it('displays start and end in local time', () => {
    moment.tz.setDefault('America/Los_Angeles');
    component.appointment = {
      id: '1',
      patientId: '2',
      firstName: 'Barb',
      lastName: 'Jones',
      startTime: '2018-06-14T17:10:04Z',
      duration: 30
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).toContain('10:10 AM - 10:40 AM');
  });

  it('emits delete event when icon clicked', (done) => {
    component.delete.subscribe(deletedAppointment => {
      expect(deletedAppointment).toBe(appointment);
      done();
    });

    fixture.debugElement.query(By.css('fa-icon')).nativeElement.click();
  });

  it('should navigate to /appointments/:id/new when time clicked', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.time')).nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe(`/appointments/${appointment.id}/edit`);
    });
  });

  it('should navigate to /patients/:id when name clicked', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.name')).nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe(`/patients/${appointment.patientId}`);
    });
  });
});
