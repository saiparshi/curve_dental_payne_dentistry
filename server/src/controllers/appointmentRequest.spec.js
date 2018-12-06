const { forCreate, forUpdate } = require('./appointmentRequest');
const moment = require('moment');

describe('AppointmentRequest', () => {
  it('creates a appointment object from valid input', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    const request = forCreate(body);

    expect(request.appointment).toEqual({ patientId: '3', startTime: moment.utc('2018-08-06 18:00:00Z'), duration: 30 });
  });

  it('updates a appointment object from valid input', () => {
    const id = '4';
    const body = {
      id: '4',
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    const request = forUpdate(id, body);

    expect(request.appointment).toEqual({ id: '4', patientId: '3', startTime: moment.utc('2018-08-06 18:00:00Z'), duration: 30 });
  });

  it('updates a appointment based on resource if id is missing from object', () => {
    const id = '4';
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    const request = forUpdate(id, body);

    expect(request.appointment).toEqual({ id: '4', patientId: '3', startTime: moment.utc('2018-08-06 18:00:00Z'), duration: 30 });
  });

  it('throws an error when id is already assigned by client forCreate', () => { 
    const body = {
      id: '4',
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when id in resource URI does not match body', () => {
    const id = '3';
    const body = {
      id: '4',
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    expect(() => forUpdate(id, body)).toThrow();
  });

  it('throws an error when patientId is missing', () => {
    const body = {
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when startTime is missing', () => {
    const body = {
      patientId: '3',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when startTime is invalid', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-32 18:00:00',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when startTime is in local time', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('accepts start time with timezone offset', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00-0600',
      duration: 30
    };

    const request = forCreate(body);

    expect(request.appointment.startTime.toISOString()).toEqual('2018-08-07T00:00:00.000Z');
  });

  it('throws an error when duration is missing', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when duration is not a number', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: '30'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when duration is not a integer', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30.1
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when duration is not a positive integer', () => {
    const body = {
      patientId: '3',
      startTime: '2018-08-06 18:00:00Z',
      duration: -1
    };

    expect(() => forCreate(body)).toThrow();
  });
});
