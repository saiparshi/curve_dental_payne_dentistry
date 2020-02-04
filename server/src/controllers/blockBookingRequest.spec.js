const { forCreate, forUpdate } = require('./blockBookingRequest');
const moment = require('moment');

describe('BlockBookingRequest', () => {
  it('creates a blockBooking object from valid input', () => {
    const body = {
      description: 'Testing',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    const request = forCreate(body);

    expect(request.blockBooking).toEqual({ description: 'Testing', startTime: moment.utc('2018-08-06 18:00:00Z'), duration: 30, recurrence:undefined, endDate:undefined });
  });

  it('updates a blockBooking object from valid input', () => {
    const id = '4';
    const body = {
      id: '4',
      description: 'Testing',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30,
      recurrence: 'RRULE:FREQ=WEEKLY;BYDAY=SU,FR',
      endDate:'2018-08-20'
    };

    const request = forUpdate(id, body);

    expect(request.blockBooking).toEqual({ id: '4', 
      description: 'Testing', 
      startTime: moment.utc('2018-08-06 18:00:00Z'), 
      duration: 30,
      recurrence: 'RRULE:FREQ=WEEKLY;BYDAY=SU,FR',
      endDate: '2018-08-20'
    });
  });

  it('updates a blockBooking based on resource if id is missing from object', () => {
    const id = '4';
    const body = {
      description: 'Testing',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    const request = forUpdate(id, body);

    expect(request.blockBooking).toEqual({ id: '4', description: 'Testing', startTime: moment.utc('2018-08-06 18:00:00Z'), duration: 30, recurrence:undefined, endDate:undefined });
  });

  it('throws an error when id is already assigned by client forCreate', () => { 
    const body = {
      id: '4',
      description: 'Tea Time',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when id in resource URI does not match body', () => {
    const id = '3';
    const body = {
      id: '4',
      description: 'Appointment',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    expect(() => forUpdate(id, body)).toThrow();
  });

  it('throws an error when description is missing', () => {
    const body = {
      startTime: '2018-08-06 18:00:00Z',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when startTime is missing', () => {
    const body = {
      description: 'Test',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when startTime is invalid', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-32 18:00:00',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when startTime is in local time', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00',
      duration: 30
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('accepts start time with timezone offset', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00-0600',
      duration: 30
    };

    const request = forCreate(body);

    expect(request.blockBooking.startTime.toISOString()).toEqual('2018-08-07T00:00:00.000Z');
  });

  it('throws an error when duration is missing', () => {
    const body = {
      description: '3',
      startTime: '2018-08-06 18:00:00Z'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when duration is not a number', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00Z',
      duration: '30'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when duration is not a integer', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30.1
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when duration is not a positive integer', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00Z',
      duration: -1
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when endDate is given without recurrence', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30,
      endDate:'2018-09-20'
    };

    expect(() => forCreate(body)).toThrow();
  });

  it('throws an error when endDate is not valid date', () => {
    const body = {
      description: 'Test',
      startTime: '2018-08-06 18:00:00Z',
      duration: 30,
      recurrence:'Test',
      endDate:'2018 09-20'
    };

    expect(() => forCreate(body)).toThrow();
  });
});
