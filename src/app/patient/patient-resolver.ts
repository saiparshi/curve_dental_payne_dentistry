import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Patient } from './patient.model';
import { PatientService } from './patient.service';
import { Observable } from 'rxjs';

@Injectable()
export class PatientResolver implements Resolve<Patient> {
  constructor(private patientService: PatientService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Patient> {
    return this.patientService.getPatient(route.params['id']);
  }
}
