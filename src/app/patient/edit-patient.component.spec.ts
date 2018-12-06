import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditPatientComponent } from './edit-patient.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PatientService } from './patient.service';
import { of, throwError } from 'rxjs';
import { Patient } from './patient.model';
import { ActivatedRoute } from '@angular/router';

const patientId = '14';
const firstName = 'Jerry';
const lastName = 'Hamilton';
const birthDate = '1983-09-12';
const patient: Patient = { id: patientId, firstName, lastName, birthDate };

describe('EditPatientComponent', () => {
  let fixture: ComponentFixture<EditPatientComponent>;
  let component: EditPatientComponent;
  let location: Location;
  let mockPatientService: PatientService;

  beforeEach(() => {
    mockPatientService = jasmine.createSpyObj('PatientService', { 'savePatient': of<Patient>(patient) });
  });

  describe('general behavior', () => {
    beforeEach(() => setupWithRouteData({}));

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

    it('redirects to /patients on cancel', () => {
      fixture.debugElement.query(By.css('button.btn-default')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/patients');
      });
    });

    it('will not submit an empty form', () => {
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      expect(mockPatientService.savePatient).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    let errorElement;

    beforeEach(() => {
      mockPatientService = jasmine.createSpyObj('PatientService', { 'savePatient': throwError(new Error('did not work')) });
      setupWithRouteData({});
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

  describe('creating new patient', () => {
    beforeEach(() => setupWithRouteData({}));

    it('creates a new patient when submit is clicked', () => {
      populateForm();
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      expect(mockPatientService.savePatient).toHaveBeenCalledWith({ id: '', firstName, lastName, birthDate });
    });

    it('navigates to /patients/:id when create returns', () => {
      populateForm();
      fixture.detectChanges();
      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe(`/patients/${patientId}`);
      });
    });
  });

  describe('editing an existing patient', () => {
    it('initializes form with patient details', () => {
      setupWithRouteData({patient});
      fixture.detectChanges();

      expect(component.form.controls['firstName'].value).toBe(firstName);
      expect(component.form.controls['lastName'].value).toBe(lastName);
      expect(component.form.controls['birthDate'].value).toBe(birthDate);
    });

    it('is resilient to invalid route data', () => {
      setupWithRouteData({patient: { }});
      fixture.detectChanges();

      expect(component.form.controls['firstName'].value).toBe('');
      expect(component.form.controls['lastName'].value).toBe('');
      expect(component.form.controls['birthDate'].value).toBe('');
    });

    it('updates an existing patient when submit is clicked', () => {
      setupWithRouteData({patient});
      fixture.detectChanges();
      component.form.controls['firstName'].setValue('Newname');

      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      expect(mockPatientService.savePatient).toHaveBeenCalledWith({ id: patientId, firstName: 'Newname', lastName, birthDate });
    });

    it('navigates to /patients/:id when save returns', () => {
      setupWithRouteData({patient});
      fixture.detectChanges();

      fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe(`/patients/${patientId}`);
      });
    });
  });

  function setupWithRouteData(data) {
    TestBed.configureTestingModule({
      declarations: [
        EditPatientComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'patients/:id', component: Component }, { path: 'patients', component: Component }])
      ],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: ActivatedRoute, useValue: { data: of(data) } }
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(EditPatientComponent);
    component = fixture.componentInstance;
  }

  function populateForm() {
    component.form.controls['firstName'].setValue(firstName);
    component.form.controls['lastName'].setValue(lastName);
    component.form.controls['birthDate'].setValue(birthDate);
  }
});
