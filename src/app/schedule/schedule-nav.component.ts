import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faCalendarAlt, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { MOMENT_TOKEN } from '../shared/moment.service';

@Component({
  selector: 'drp-schedule-nav',
  template: `
      <fa-icon (click)="toPreviousDay()" [icon]="previousDay" size="lg"></fa-icon>
      <fa-icon (click)="toToday()" [icon]="today" size="lg"></fa-icon>
      <fa-icon (click)="toNextDay()" [icon]="nextDay" size="lg"></fa-icon>
   `,
   styles: [`
      fa-icon { cursor: pointer; }
      .ng-fa-icon { margin-left: 20px; color: rgba(255, 255, 255, 0.75); }
      .ng-fa-icon:hover { color: #fff }
   `]
})
export class ScheduleNavComponent {
  @Input() date: any;
  previousDay: IconDefinition;
  nextDay: IconDefinition;
  today: IconDefinition;

  constructor(private router: Router, @Inject(MOMENT_TOKEN) private moment: any) {
      this.previousDay = faAngleLeft;
      this.today = faCalendarAlt;
      this.nextDay = faAngleRight;
   }

  toPreviousDay() {
    const previousDate = this.date.clone().subtract(1, 'day');
    this.router.navigate(['/schedule', previousDate.format('YYYY-MM-DD')]);
  }

  toToday() {
    this.router.navigate(['/schedule']);
  }

  toNextDay() {
    const nextDate = this.date.clone().add(1, 'day');
    this.router.navigate(['/schedule', nextDate.format('YYYY-MM-DD')]);
  }
}
