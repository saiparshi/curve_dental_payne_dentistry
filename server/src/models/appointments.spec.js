const moment = require('moment');
const appointments = require('./appointments');

describe('appointments model', () => {
  it('retrieves all patients', async () => {
    const result = await appointments.getAll();

    expect(result.length).toBeGreaterThan(1);
  });

  it('retrieves an existing patient', async () => {
    const appointment = await appointments.get('1');

    expect(appointment).toEqual({
      id: '1',
      patientId: '1',
      firstName: 'Alek',
      lastName: 'Ziemann',
      startTime: moment.utc('2018-04-06T04:00:00Z'),
      duration: 45
    });
  });

  it('returns null when appointment does not exist', async () => {
    const appointment = await appointments.get('2222');

    expect(appointment).toBeNull();
  });

  it('retrieves appointments in the half-open range [start, end)', async () => {
    let appointmentsByDay = await appointments.getBetween(moment.utc('2018-04-06T04:00:00Z'), moment.utc('2018-04-06T20:00:00Z'));

    expect(appointmentsByDay.length).toBe(1);

    appointmentsByDay = await appointments.getBetween(moment.utc('2018-04-06T04:00:00Z'), moment.utc('2018-04-06T20:00:01Z'));

    expect(appointmentsByDay.length).toBe(2);
  });

  it('creates a new appointment and returns object with id populated', async () => {
    let appointment = {
      patientId: '2',
      startTime: moment.utc('2018-08-06T18:00:00Z'),
      duration: 30
    };
    appointment = await appointments.create(appointment);

    expect(appointment.id).toEqual('4');
  });

  it('updates an existing appointment and returns the appointment', async () => {
    let appointment = {
      id: '2',
      patientId: '3',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45
    };
    let updatedAppointment = await appointments.update(appointment);

    expect(updatedAppointment).toEqual({
      id: '2',
      patientId: '3',
      firstName: 'Lều',
      lastName: 'Pham',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45
    });
  });

  it('throws an error when updating a non-existent appointment', async () => {
    let appointment = {
      id: '7',
      patientId: '3',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45
    };
    let error = null;

    try {
      await appointments.update(appointment);
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });

  it('throws an error when updating an appointment to a non-existent patient', async () => {
    let appointment = {
      id: '2',
      patientId: '7',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45
    };
    let error = null;

    try {
      await appointments.update(appointment);
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });

  it('deletes existing appointment', async () => {
    await appointments.delete('2');
    let appointment = await appointments.get('2');

    expect(appointment).toBeNull();
  });

  it('throws error when deleting non-existent appointment', async () => {
    let error = null;
    try {
      await appointments.delete('1704');
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });
});
