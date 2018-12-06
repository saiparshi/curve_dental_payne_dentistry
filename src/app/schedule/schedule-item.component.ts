import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Appointment } from './appointment.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { IconDefinition, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'drp-schedule-item',
  templateUrl: './schedule-item.component.html',
  styles: [`
    .card { padding: 10px; }
    fa-icon { cursor: pointer; color: rgba(255, 255, 255, 0.75); }
    fa-icon:hover { color: #fff }
  `]
})
export class ScheduleItemComponent {
  @Input() appointment: Appointment;
  @Output() delete = new EventEmitter<Appointment>();
  deleteIcon: IconDefinition;

  constructor(@Inject(MOMENT_TOKEN) private moment: any) {
    this.deleteIcon = faTrash;
  }

  formatTime() {
    const start = this.moment(this.appointment.startTime);
    const end = start.clone().add(this.appointment.duration, 'minute');

    return `${start.format('LT')} - ${end.format('LT')}`;
  }
}
