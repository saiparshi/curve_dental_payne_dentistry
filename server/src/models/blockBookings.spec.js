const moment = require('moment');
const blockBookings = require('./blockBookings');

describe('blockBookings model', () => {
  it('retrieves all blockBookings', async () => {
    const result = await blockBookings.getAll();

    expect(result.length).toBeGreaterThan(1);
  });

  it('retrieves an existing blockBooking', async () => {
    const blockBooking = await blockBookings.get('1');

    expect(blockBooking).toEqual({
      id: '1',
      description: 'Doctor Appointment',
      startTime: moment.utc('2018-10-17T10:00:00Z'),
      duration: 60,
      recurrence:'',
      endDate:''
    });
  });

  it('returns null when blockBooking does not exist', async () => {
    const blockBooking = await blockBookings.get('2222');

    expect(blockBooking).toBeNull();
  });

  it('retrieves blockBookings in the half-open range [start, end)', async () => {
    let blockBookingsByDay = await blockBookings.getBetween(moment.utc('2018-10-17T09:00:00Z'), moment.utc('2018-10-17T15:00:00Z'));

    expect(blockBookingsByDay.length).toBe(1);
  });

  it('creates a new blockBooking and returns object with id populated', async () => {
    let blockBooking = {
      description: 'Test',
      startTime: moment.utc('2018-08-06T18:00:00Z'),
      duration: 30
    };
    blockBooking = await blockBookings.create(blockBooking);

    expect(blockBooking.id).toEqual('4');
  });

  it('updates an existing blockBooking and returns the blockBooking', async () => {
    let blockBooking = {
      id: '2',
      description: 'Test',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45
    };
    let updatedblockBooking = await blockBookings.update(blockBooking);

    expect(updatedblockBooking).toEqual({
      id: '2',
      description: 'Test',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45,
      recurrence: null,
      endDate: null
    });
  });

  it('throws an error when updating a non-existent blockBooking', async () => {
    let blockBooking = {
      id: '7',
      description: '3',
      startTime: moment.utc('2018-04-07T20:00:00Z'),
      duration: 45
    };
    let error = null;

    try {
      await blockBookings.update(blockBooking);
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });

  it('deletes existing blockBooking', async () => {
    await blockBookings.delete('2');
    let blockBooking = await blockBookings.get('2');

    expect(blockBooking).toBeNull();
  });

  it('throws error when deleting non-existent blockBooking', async () => {
    let error = null;
    try {
      await blockBookings.delete('1704');
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });
});
