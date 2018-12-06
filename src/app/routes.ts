import { Routes } from '@angular/router';
import { PatientsListComponent, PatientDetailComponent, PatientResolver } from './patient';
import { EditPatientComponent } from './patient/edit-patient.component';
import { ScheduleDayComponent } from './schedule/schedule-day.component';
import { EditAppointmentComponent } from './appointment';
import { AppointmentResolver } from './appointment/appointment-resolver';

export const appRoutes: Routes = [
  { path: 'schedule/:date', component: ScheduleDayComponent },
  { path: 'schedule', component: ScheduleDayComponent },
  { path: 'patients/new', component: EditPatientComponent },
  { path: 'patients/:id/edit', component: EditPatientComponent, resolve: {patient: PatientResolver} },
  { path: 'patients/:id', component: PatientDetailComponent, resolve: {patient: PatientResolver} },
  { path: 'patients', component: PatientsListComponent },
  { path: 'appointments/:id/new', component: EditAppointmentComponent, resolve: { patient: PatientResolver } },
  { path: 'appointments/:id/edit', component: EditAppointmentComponent, resolve: { appointment: AppointmentResolver} },
  { path: '', redirectTo: '/schedule', pathMatch: 'full' }
];
