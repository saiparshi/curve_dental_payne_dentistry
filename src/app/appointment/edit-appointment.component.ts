import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Appointment } from './appointment.model';
import { MOMENT_TOKEN } from '../shared/moment.service';
import { AppointmentService } from './appointment.service';
import { Patient } from '../patient';

const DEFAULT_APPOINTMENT_DURATION = 30;

@Component({
  selector: 'drp-appointment-edit',
  templateUrl: './edit-appointment.component.html',
  styles: [`
    em { float: right; color: #E05C65; padding-left: 10px; }
    .error input { background-color: #E3C3C5; }
    .error ::-webkit-input-placeholder { color: #999; }
    .error ::-moz-placeholder { color: #999; }
    .error :-moz-placeholder { color: #999; }
    .error :ms-input-placeholder { color: #999; }
  `]
})
export class EditAppointmentComponent implements OnInit {
  // Access to native elements required because Angular doesn't bind to valueAsDate
  @ViewChild('dateEl') dateEl: ElementRef;
  @ViewChild('timeEl') timeEl: ElementRef;
  date = new FormControl('', Validators.required);
  time = new FormControl('', Validators.required);
  duration = new FormControl(
    DEFAULT_APPOINTMENT_DURATION,
    [Validators.required, Validators.min(0), Validators.max(1439)]
  );
  form: FormGroup;

  // Either a new appointment based on a Patient or an existing Appointment
  appointment: Appointment;

  saveError: string;

  constructor(
    fb: FormBuilder,
    @Inject(MOMENT_TOKEN) private moment: any,
    private router: Router,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {
    this.form = fb.group({
      'date': this.date,
      'time': this.time,
      'duration': this.duration
    });
  }

  ngOnInit() {
    // Accepts either a Patient via data['patient'] when creating a new appointment
    // or an Appointment when updating an existing appointment
    this.route.data.forEach(data => {
      if (data['appointment']) {
        this.appointment = this.createApptForAppt(data['appointment']);
      } else if (data['patient']) {
        this.appointment = this.createApptForPatient(data['patient']);
      }
      this.date.setValue(this.appointment.startTime.format('YYYY-MM-DD'));
      this.time.setValue(this.appointment.startTime.format('HH:mm'));
      this.duration.setValue(this.appointment.duration);
    });
  }

  /**
   * Does a deep copy of the passed in appointment to ensure we don't mutate
   * its state.
   */
  private createApptForAppt(appointment: Appointment): Appointment {
    return {
      id: appointment.id,
      patientId: appointment.patientId,
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      startTime: appointment.startTime.clone(),
      duration: appointment.duration
    };
  }

  private createApptForPatient(patient: Patient): Appointment {
    const now = this.moment();
    return {
      id: null,
      patientId: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      startTime: this.moment(now.utc().format('YYYY-MM-DDTHH:00:00\\Z')),
      duration: DEFAULT_APPOINTMENT_DURATION
    };
  }

  saveAppointment(formValue) {
    this.appointment.startTime = this.createMomentFromFormElements();
    this.appointment.duration = +formValue.duration;
    this.saveError = '';

    this.appointmentService.saveAppointment(this.appointment).subscribe((result: Appointment) => {
      this.router.navigate(['/schedule', result.startTime.format('YYYY-MM-DD')]);
    }, (error: Error) => {
      this.saveError = error.message;
    });
  }

  /**
   * Handles the trickiest part of this component - dealing with HTML date and time input
   * controls and JavaScripts legacy Date object.
   *
   * Retrieves the UTC values from the controls which will, surprisingly, actually be in
   * local time.  If the local calls are used the time will be off by an amount equal to
   * the browser's timezone offset (e.g. -6 hours in MDT).
   */
  private createMomentFromFormElements() {
    return this.moment([
      this.dateEl.nativeElement.valueAsDate.getUTCFullYear(),
      this.dateEl.nativeElement.valueAsDate.getUTCMonth(),
      this.dateEl.nativeElement.valueAsDate.getUTCDate(),
      this.timeEl.nativeElement.valueAsDate.getUTCHours(),
      this.timeEl.nativeElement.valueAsDate.getUTCMinutes()
    ]);
  }

  cancel() {
    this.router.navigate(['/schedule']);
  }
}
