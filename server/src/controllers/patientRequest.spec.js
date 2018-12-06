const { forCreate, forUpdate } = require('./patientRequest');

describe('PatientRequest', () => {
  it('creates a patient object from valid input', () => {
    const body = {
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: '1977-01-01'
    };

    const request = forCreate(body);

    expect(request.patient).toEqual({ firstName: 'Marjorie', lastName: 'Brown', birthDate: '1977-01-01'});
  });

  it('updates a patient object from valid input', () => {
    const id = '4';
    const body = {
      id: '4',
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: '1977-01-01'
    };

    const request = forUpdate(id, body);

    expect(request.patient).toEqual({ id: '4', firstName: 'Marjorie', lastName: 'Brown', birthDate: '1977-01-01'});
  });

  it('updates a patient based on resource if id is missing from object', () => {
    const id = '4';
    const body = {
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: '1977-01-01'
    };

    const request = forUpdate(id, body);

    expect(request.patient).toEqual({ id: '4', firstName: 'Marjorie', lastName: 'Brown', birthDate: '1977-01-01'});
  });

  it('throws an error when id is already assigned by client forCreate', () => { 
    const body = {
      id: '4',
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: '1977-01-01'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when id in resource URI does not match body', () => {
    const id = '3';
    const body = {
      id: '4',
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: '1977-01-01'
    };

    expect(() => forUpdate(id, body)).toThrow();
  });

  it('throws an error when firstName is missing', () => {
    const body = {
      firstName: '',
      lastName: 'Brown',
      birthDate: '1977-01-01'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when lastName is missing', () => {
    const body = {
      firstName: 'Marjorie',
      lastName: '',
      birthDate: '1977-01-01'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when birth date is missing', () => {
    const body = {
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: ''
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when birthdate is not a valid date', () => {
    const body = {
      firstName: 'Marjorie',
      lastName: 'Brown',
      birthDate: '1977-04-31'
    };

    expect(() => forCreate(body)).toThrow();
  });
});
