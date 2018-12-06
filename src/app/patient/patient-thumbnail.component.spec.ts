import { PatientThumbnailComponent } from './patient-thumbnail.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Patient } from './patient.model';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

const patient: Patient = { id: '1', firstName: 'Sam', lastName: 'Haynes', birthDate: '2000-01-01' };

let component: PatientThumbnailComponent;
let fixture:   ComponentFixture<PatientThumbnailComponent>;
let cardTitle: HTMLElement;
let cardText:  HTMLElement;

describe('PatientThumbnailComponent', () => {
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientThumbnailComponent ],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'patients/:id', component: Component}])
      ]
    }).compileComponents();

    location = TestBed.get(Location);

    fixture = TestBed.createComponent(PatientThumbnailComponent);
    component = fixture.componentInstance;
    component.patient = patient;
    cardTitle = fixture.nativeElement.querySelector('.card-title');
    cardText =  fixture.nativeElement.querySelector('.card-text');
  });

  it('should display patient name in title', () => {
    fixture.detectChanges();

    expect(cardTitle.textContent).toContain(patient.firstName);
    expect(cardTitle.textContent).toContain(patient.lastName);
  });

  it('should display birth date in text', () => {
    fixture.detectChanges();

    expect(cardText.textContent).toContain(patient.birthDate);
  });

  it('should navigate to /patients/:id when clicked', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.card')).nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/patients/' + patient.id);
    });
  });
});
