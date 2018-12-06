import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from './appointment.model';
import { EditAppointmentComponent } from './edit-appointment.component';
import { AppointmentService } from './appointment.service';
import * as moment from 'moment';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { Patient } from '../patient/patient.model';

const appointmentId = '76';
const patientId = '14';
const firstName = 'Jerry';
const lastName = 'Hamilton';
const startTime = moment('2018-08-14T15:00:00Z');
const duration = 65;
const today = new Date(2018, 6, 24, 14, 10);
const appointment: Appointment = { id: appointmentId, patientId, firstName, lastName, startTime, duration };
const patient: Patient = { id: patientId, firstName, lastName, birthDate: '1993-07-22' };

describe('EditAppointmentComponent', () => {
  let fixture: ComponentFixture<EditAppointmentComponent>;
  let component: EditAppointmentComponent;
  let location: Location;
  let mockAppointmentService: AppointmentService;

  beforeEach(() => {
    jasmine.clock().mockDate(today);
    jasmine.addCustomEqualityTester(appointmentEquals);
    mockAppointmentService = jasmine.createSpyObj(
      'AppointmentService',
      { 'saveAppointment': of<Appointment>(appointment) }
    );
  });

  describe('general behavior', () => {
    beforeEach(() => setupWithRouteData({ patient }));

    it('can create the component', () => {
      expect(component).toBeTruthy();
    });

    it('form invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('form valid when filled in', () => {
      populateForm();
      expect(component.form.valid).toBeTruthy();
    });

    it('redirects to /schedule on cancel', () => {
      fixture.debugElement.query(By.css('button.btn-default')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/schedule');
      });
    });

    it('will not submit an empty form', () => {
      fixture.detectChanges();
      component.form.controls['duration'].setValue('');
      fixture.detectChanges();

      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      expect(mockAppointmentService.saveAppointment).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    let errorElement;

    beforeEach(() => {
      mockAppointmentService = jasmine.createSpyObj(
        'AppointmentService',
        { 'saveAppointment': throwError(new Error('did not work')) }
      );
      setupWithRouteData({ patient });
      errorElement = fixture.nativeElement.querySelector('.alert-danger');
    });

    it('displays an error message when submit fails', () => {
      populateForm();
      fixture.detectChanges();

      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(errorElement.textContent).toContain('did not work');
        expect(location.path()).toBe('');
      });
    });
  });

  describe('creating new appointment', () => {
    beforeEach(() => setupWithRouteData({ patient }));

    it('creates a new appointment when submit is clicked', () => {
      fixture.detectChanges();
      populateForm();
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      expect(mockAppointmentService.saveAppointment).toHaveBeenCalledWith({ id: null, patientId, startTime, duration });
    });

    it('navigates to /schedule/:date when create returns', () => {
      populateForm();
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe(`/schedule/${startTime.format('YYYY-MM-DD')}`);
      });
    });
  });

  describe('editing an existing appointment', () => {

    it('initializes form with appointment details', () => {
      setupWithRouteData({ appointment });
      fixture.detectChanges();

      expect(component.form.controls['date'].value).toBe(startTime.format('YYYY-MM-DD'));
      expect(component.form.controls['time'].value).toBe(startTime.format('HH:mm'));
      expect(component.form.controls['duration'].value).toBe(duration);
    });

    it('is resilient to invalid route data', () => {
      setupWithRouteData({ patient: {} });
      fixture.detectChanges();

      expect(component.form.controls['date'].value).toBe('2018-07-24');
      expect(component.form.controls['time'].value).toBe('14:00');
      expect(component.form.controls['duration'].value).toBe(30);
    });

    it('updates an existing patient when submit is clicked', () => {
      setupWithRouteData({ appointment });
      fixture.detectChanges();
      component.form.controls['date'].setValue('2018-09-15');
      component.form.controls['time'].setValue('13:35');
      component.form.controls['duration'].setValue(15);

      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      expect(mockAppointmentService.saveAppointment)
        .toHaveBeenCalledWith({ id: appointmentId, patientId, startTime: moment('2018-09-15 13:35'), duration: 15 });
    });

    it('navigates to /schedule/:date when save returns', () => {
      setupWithRouteData({ appointment });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe(`/schedule/${startTime.format('YYYY-MM-DD')}`);
      });
    });
  });

  /**
   * Configures the test bed with data for the ActivatedRoute.
   *
   * This is not inline in the suite's beforeEach method because testing
   * error scenarios and create vs. edit appointment requires different
   * route data and mock AppointmentService.
  */
  function setupWithRouteData(data) {
    TestBed.configureTestingModule({
      declarations: [
        EditAppointmentComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'schedule/:date', component: Component },
          { path: 'schedule', component: Component }]
        )
      ],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: ActivatedRoute, useValue: { data: of(data) } },
        { provide: MOMENT_TOKEN, useValue: moment }
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(EditAppointmentComponent);
    component = fixture.componentInstance;
  }

  function populateForm() {
    component.form.controls['date'].setValue(startTime.format('YYYY-MM-DD'));
    component.form.controls['time'].setValue(startTime.format('HH:mm'));
    component.form.controls['duration'].setValue(duration);
  }

  /**
   * Jasmine equality matcher for mock AppointmentService toHaveBeenCalledWith. Required
   * to correctly compare two Moment objects.
   *
   * @param { Appointment[]|any } first actual value
   * @param { Appointment[]|any } second expected value
   * @returns { boolean|null } boolean if arguments are appointments, otherwise null
   */
  function appointmentEquals(first, second) {
    if (!(Array.isArray(first) && Array.isArray(second) &&
      first.length === 1 && second.length === 1 &&
      moment.isMoment(first[0].startTime) && moment.isMoment(second[0].startTime))) {
      // Not comparing two Appointment objects.  Intentionally returning null so that
      // Jasmine runs other equality matchers.
      return;
    }
    return first[0].id === second[0].id &&
      first[0].patientId === second[0].patientId &&
      first[0].startTime.toISOString() === second[0].startTime.toISOString() &&
      first[0].duration === second[0].duration;
  }
});
