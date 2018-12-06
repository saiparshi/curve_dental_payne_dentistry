import { ScheduleNavComponent } from './schedule-nav.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { By } from '@angular/platform-browser';
import { MOMENT_TOKEN } from '../shared/moment.service';
import * as moment from 'moment';

describe('ScheduleNavComponent', () => {
  let fixture: ComponentFixture<ScheduleNavComponent>;
  let component: ScheduleNavComponent;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScheduleNavComponent
      ],
      imports: [
        FontAwesomeModule,
        RouterTestingModule.withRoutes([
          { path: 'schedule/:date', component: Component },
          { path: 'schedule', component: Component }
        ])
      ],
      providers: [
        { provide: MOMENT_TOKEN, useValue: moment }
      ]
    }).compileComponents();

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(ScheduleNavComponent);
    component = fixture.componentInstance;
    component.date = moment('2018-05-17');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /schedule with calendar clicked', () => {
    fixture.debugElement.queryAll(By.css('fa-icon'))[1].nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/schedule');
    });
  });

  it('should navigate to previous day when left clicked', () => {
    fixture.debugElement.queryAll(By.css('fa-icon'))[0].nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/schedule/2018-05-16');
    });
  });

  it('should navigate to next day when right clicked', () => {
    fixture.debugElement.queryAll(By.css('fa-icon'))[2].nativeElement.click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/schedule/2018-05-18');
    });
  });
});
