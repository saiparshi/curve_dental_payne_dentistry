import { PatientsListComponent } from './patients-list.component';
import { of } from 'rxjs';
import { Patient } from './patient.model';

const patient: Patient = { id: '1', firstName: 'Test', lastName: 'Patient', birthDate: '1997-01-01'};

describe('PatientsListComponent', async () => {
  let component: PatientsListComponent;
  let mockPatientService;

  it('should create the component', () => {
    component = new PatientsListComponent(mockPatientService);

    expect(component).toBeTruthy();
  });

  it('should retrieve a current list of patients when initialized', () => {
    mockPatientService = jasmine.createSpyObj('mockPatientService', ['getPatients']);
    mockPatientService.getPatients.and.returnValue(of(<Patient[]>[patient]));

    component = new PatientsListComponent(mockPatientService);

    component.ngOnInit();

    expect(component.patients).toEqual([patient]);
  });
});
