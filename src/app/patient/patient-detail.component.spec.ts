import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PatientDetailComponent } from './patient-detail.component';
import { Patient } from './patient.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component } from '@angular/core';

const patient: Patient = { id: '1', firstName: 'Yasmin', lastName: 'Apt', birthDate: '1964-05-13' };

describe('PatientDetailComponent', () => {
  let fixture: ComponentFixture<PatientDetailComponent>;
  let component: PatientDetailComponent;
  let titleElement: HTMLElement;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatientDetailComponent
      ],
      imports: [
        FontAwesomeModule,
        RouterTestingModule.withRoutes([
          { path: 'patients/:id/edit', component: Component },
          { path: 'appointments/:id/new', component: Component}
        ])
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({patient})}}
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.debugElement.componentInstance;
    titleElement = fixture.nativeElement.querySelector('.title');
   });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show the patient name', () => {
    fixture.detectChanges();

    expect(titleElement.textContent).toContain('Apt, Yasmin');
  });

  it('should navigate to edit route on click edit', () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css('fa-icon')).nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe(`/patients/${patient.id}/edit`);
    });
  });

  it('should navigate to new appointment route on click', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('a')).nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe(`/appointments/${patient.id}/new`);
    });
  });
});
