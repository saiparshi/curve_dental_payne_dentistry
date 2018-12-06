const patients = require('./patients');

describe('patients model', () => {
  it('retrieves all patients', async () => {
    let allPatients = await patients.getAll();

    expect(allPatients.length).toBeGreaterThan(1);
  });

  it('retrieves an existing patient', async () => {
    let patient = await patients.get('1');

    expect(patient).toEqual({ id: '1', firstName: 'Alek', lastName: 'Ziemann', birthDate: '1973-03-05' });
  });

  it('returns null when patient does not exist', async () => {
    let patient = await patients.get('notapatient');

    expect(patient).toBeNull();
  });

  it('deletes existing patient', async () => {
    await patients.delete('2');
    let patient = await patients.get('2');

    expect(patient).toBeNull();
  });

  it('throws error when deleting non-existent patient', async () => {
    let error = null;
    try {
      await patients.delete('1704');
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });

  it('creates a new patient and returns object with id populated', async () => {
    let patient = { firstName: 'new', lastName: 'patient', birthDate: '1980-01-01' };
    await patients.create(patient);

    expect(patient.id).toBeDefined();
  });

  it('updates an existing patient and returns the patient', async() => {
    let patient = { id: '3', firstName: 'updated', lastName: 'patient', birthDate: '1980-01-02' };
    await patients.update(patient);
  });

  it('throws an error when updating a non-existent patient', async () => {
    let patient = { id: '1705', firstName: 'updated', lastName: 'patient', birthDate: '1980-01-02' };
    let error = null;
    try {
      await patients.update(patient);
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });
});