const request = require('supertest');

const app = require('../server');

describe('GET /api/blockBookings', () => {
  it('returns a list of blockBooking', async () => {
    const response = await request(app)
      .get('/api/blockBookings')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.blockBookings.length).toBeGreaterThan(1);
  });
});

describe('GET /api/blockBookings/:id', () => {
  it('returns a specific blockBooking', async () => {
    await request(app)
      .get('/api/blockBookings/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ id: '1', description: 'Doctor Appointment', startTime: '2018-10-17T10:00:00Z', duration: 60, recurrence: '', endDate: '' });
  });

  it('returns not found when retrieved blockBooking does not exist', async () => {
    await request(app)
      .get('/api/blockBookings/notfound')
      .expect(404);
  });
});

describe('GET /api/blockBookings/:date', () => {
  describe('in UTC', () => {
    it('returns a list of blockBookings occurring on the date', async () => {
      const response = await request(app)
        .get('/api/blockBookings/2018-10-17')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.blockBookings.length).toBe(1);
    });

    it('returns an empty array when no blockBookings exist on the date', async () => {
      const response = await request(app)
        .get('/api/blockBookings/2018-10-18')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.blockBookings.length).toBe(0);
    });
  });

  describe('in local time', () => {
    it('returns a list of blockBookings occurring on the date', async () => {
      const response = await request(app)
        .get('/api/blockBookings/2018-10-17?tz=America/Los_Angeles')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.blockBookings).toEqual([{
        id: '1',
        description: 'Doctor Appointment',
        startTime: '2018-10-17T10:00:00Z',
        duration: 60,
        recurrence: '',
        endDate: ''
      }]);
    });

    it('returns bad request when timezone is invalid', async () => {
      await request(app)
        .get('/api/blockBookings/2018-04-05?tz=NotAReal/TimeZone')
        .expect(400);
    });
  });

  it('returns not found for invalid date', async () => {
    await request(app)
      .get('/api/blockBookings/2018-13-07')
      .expect(404);
  });
});

describe('POST /api/blockBookings', () => {
  it('creates a new blockBooking', async () => {
    await request(app)
      .post('/api/blockBookings')
      .send({ description:'Testing', startTime: '2018-08-06T18:00:00Z', duration: 30 , recurrence:'RRULE:FREQ=WEEKLY;BYDAY=SU,FR', endDate:'2018-08-20'})
      .expect(201)
      .expect({ id: '4', description: 'Testing', startTime: '2018-08-06T18:00:00Z', duration: 30 , recurrence:'RRULE:FREQ=WEEKLY;BYDAY=SU,FR', endDate:'2018-08-20' });
  });

  it('returns bad request when request incorrectly formatted', async () => {
    await request(app)
      .post('/api/blockBookings')
      .send({ startTime: '2018-08-06 18:00:00', duration: 'empty' })
      .expect(400);
  });
});

describe('PUT /api/blockBookings/:id', () => {
  it('updates an existing blockBooking', async () => {
    await request(app)
      .put('/api/blockBookings/1')
      .send({description:'Doctor Appointment', startTime: '2018-08-06T18:00:00Z', duration: 30 })
      .expect(200)
      .expect({id: '1', description: 'Doctor Appointment', startTime: '2018-08-06T18:00:00Z', duration: 30, recurrence: null, endDate: null});
  });

  it('returns bad request when request incorrectly formatted', async () => {
    await request(app)
      .put('/api/blockBookings/2')
      .send({ startTime: '2018-08-06 18:00:00', duration: 'empty' })
      .expect(400);
  });

  it('returns not found when blockBooking does not exist', async () => {
    await request(app)
      .put('/api/blockBookings/7')
      .send({ id: '7', description:'Testing', startTime: '2018-08-06 18:00:00Z', duration: 30 })
      .expect(404);
  });
});

describe('DELETE /api/blockBookings/:id', () => {
  it('returns no content when blockBooking deleted', async () => {
    await request(app)
      .delete('/api/blockBookings/3')
      .expect(204);
  });

  it('returns not found when blockBooking does not exist', async () => {
    await request(app)
      .delete('/api/blockBookings/notfound')
      .expect(404);
  });
});
