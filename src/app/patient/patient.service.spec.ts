import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { Patient } from './patient.model';

const patient: Patient = { id: '1', firstName: 'Test', lastName: 'Patient', birthDate: '1997-01-01'};

describe('PatientService', () => {
  let patientService: PatientService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PatientService ],
      imports: [ HttpClientTestingModule ]
    });

    patientService = TestBed.get(PatientService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('returns a list of patients', () => {
    patientService.getPatients().subscribe(patients => {
      expect(patients).toEqual([patient]);
    });

    const req = httpTestingController.expectOne('/api/patients');
    expect(req.request.method).toBe('GET');
    req.flush({ patients: [patient] });

    httpTestingController.verify();
  });

  it('returns a single patient', () => {
    patientService.getPatient('1').subscribe(returnedPatient => {
      expect(returnedPatient).toEqual(patient);
    });

    const req = httpTestingController.expectOne('/api/patients/1');
    expect(req.request.method).toBe('GET');
    req.flush(patient);

    httpTestingController.verify();
  });

  it('creates a patient and returns the object with the id set', () => {
    const newPatient: Patient = { id: null, firstName: 'Ben', lastName: 'Smith', birthDate: '2004-03-22' };
    const createdPatient: Patient = { id: '2', firstName: 'Ben', lastName: 'Smith', birthDate: '2004-03-22' };

    patientService.savePatient(newPatient).subscribe(returnedPatient => {
      expect(returnedPatient).toEqual(createdPatient);
    });

    const req = httpTestingController.expectOne('/api/patients');
    expect(req.request.method).toBe('POST');
    req.flush(createdPatient);

    httpTestingController.verify();
  });

  it('updates a patient and returns the object', () => {
    const existingPatient: Patient = { id: '2', firstName: 'Ben', lastName: 'Smith', birthDate: '2004-03-22' };
    const updatedPatient: Patient = { id: '2', firstName: 'Ben', lastName: 'Smith', birthDate: '2004-03-22' };

    patientService.savePatient(existingPatient).subscribe(returnedPatient => {
      expect(returnedPatient).toEqual(updatedPatient);
    });

    const req = httpTestingController.expectOne('/api/patients/2');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPatient);

    httpTestingController.verify();
  });
});
