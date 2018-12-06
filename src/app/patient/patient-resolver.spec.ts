import { TestBed } from '@angular/core/testing';
import { PatientResolver } from './patient-resolver';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PatientService } from './patient.service';
import { Patient } from './patient.model';
import { of } from 'rxjs';

const patient: Patient = { id: '1', firstName: 'Yasmin', lastName: 'Apt', birthDate: '1964-05-13' };

describe('PatientResolver', () => {
  let patientService: PatientService;
  let resolver: PatientResolver;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientResolver,
        { provide: PatientService, useValue: { getPatient: () => of(patient) } },
        { provide: ActivatedRouteSnapshot, useValue: { params: { id: patient.id}} }
      ]
    });

    patientService = TestBed.get(PatientService);
    resolver = TestBed.get(PatientResolver);
    route = TestBed.get(ActivatedRouteSnapshot);
    spyOn(patientService, 'getPatient').and.callThrough();
  });

  it('resolves to a patient object', () => {
    resolver.resolve(route).subscribe(resolvedPatient => {
      expect(patientService.getPatient).toHaveBeenCalledWith(patient.id);
      expect(resolvedPatient).toEqual(patient);
    });
  });
});
