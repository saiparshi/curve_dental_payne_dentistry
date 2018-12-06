import { Component, OnInit, Inject } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { Appointment } from './appointment.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'drp-schedule-day',
  templateUrl: './schedule-day.component.html'
})
export class ScheduleDayComponent implements OnInit {
  appointments: Appointment[];
  date: any; // Moment

  constructor(
    private scheduleService: ScheduleService,
    @Inject(MOMENT_TOKEN) private moment: any,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.date = this.moment(this.route.snapshot.params.date);
    if (!this.date.isValid()) {
      this.date = this.moment();
    }

    this.route.params.subscribe(params => {
      let date = this.moment(params.date, 'YYYY-MM-DD', true);
      if (!date.isValid()) {
        date = this.moment();
      }
      this.updateSchedule(date);
   });
  }

  deleteAppointment(appointment) {
    this.scheduleService.delete(appointment).then(() => this.updateSchedule(this.date));
  }

  private updateSchedule(date) {
    this.scheduleService.getSchedule(date.format('YYYY-MM-DD')).subscribe(appointments => {
      this.date = date;
      this.appointments = appointments;
    });
  }
}
