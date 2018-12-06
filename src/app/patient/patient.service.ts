import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient } from './patient.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PatientService {
  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get('/api/patients')
      .pipe(map(response => <Patient[]>response['patients']));
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>('/api/patients/' + id);
  }

  savePatient(patient: Patient): Observable<Patient> {
    if (patient.id) {
      return this.http.put<Patient>(`/api/patients/${patient.id}`, patient);
    } else {
      return this.http.post<Patient>('/api/patients', patient);
    }
  }
}
