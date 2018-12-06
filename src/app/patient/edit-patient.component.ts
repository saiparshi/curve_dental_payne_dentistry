import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from './patient.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Patient } from './patient.model';

@Component({
  selector: 'drp-patient-create',
  templateUrl: './edit-patient.component.html',
  styles: [`
    em { float: right; color: #E05C65; padding-left: 10px; }
    .error input { background-color: #E3C3C5; }
    .error ::-webkit-input-placeholder { color: #999; }
    .error ::-moz-placeholder { color: #999; }
    .error :-moz-placeholder { color: #999; }
    .error :ms-input-placeholder { color: #999; }
  `]
})
export class EditPatientComponent implements OnInit {
  patientId: string;
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  birthDate = new FormControl('', Validators.required);
  form: FormGroup;
  saveError: string;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {
    this.form = fb.group({
      'firstName': this.firstName,
      'lastName': this.lastName,
      'birthDate': this.birthDate
    });
  }

  ngOnInit() {
    this.route.data.forEach(data => {
      const patient = data['patient'];
      if (patient) {
        this.patientId = patient.id || '';
        this.firstName.setValue(patient.firstName || '');
        this.lastName.setValue(patient.lastName || '');
        this.birthDate.setValue(patient.birthDate || '');
      } else {
        this.patientId = '';
      }
    });
  }

  savePatient(formValue) {
    const updatedPatient: Patient = {
      id: this.patientId,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthDate: formValue.birthDate
    };

    this.saveError = '';
    this.patientService.savePatient(updatedPatient).subscribe((patient: Patient) => {
      this.router.navigate(['/patients', patient.id]);
    }, (error: Error) => {
      this.saveError = error.message;
    });
  }

  cancel() {
    this.router.navigate(['/patients']);
  }
}
