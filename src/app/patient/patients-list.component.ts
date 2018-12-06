import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { Patient } from './patient.model';

@Component({
  'selector': 'drp-patients-list',
  template: `
    <div>
      <h3>Patient List</h3>
      <div class="row">
        <div *ngFor="let patient of patients" class="col-md-5">
          <drp-patient-thumbnail [patient]="patient"></drp-patient-thumbnail>
        </div>
      </div>
    </div>
  `
})
export class PatientsListComponent implements OnInit {
  patients: Patient[];

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => this.patients = patients);
  }
}
