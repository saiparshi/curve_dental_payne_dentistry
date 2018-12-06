const request = require('supertest');

const app = require('../server');

describe('GET /api/appointments', () => {
  it('returns a list of appointments', async () => {
    const response = await request(app)
      .get('/api/appointments')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.appointments.length).toBeGreaterThan(1);
  });
});

describe('GET /api/appointments/:id', () => {
  it('returns a specific appointment', async () => {
    await request(app)
      .get('/api/appointments/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ id: '1', patientId: '1', firstName: 'Alek', lastName: 'Ziemann', startTime: '2018-04-06T04:00:00Z', duration: 45 });
  });

  it('returns not found when retrieved appointment does not exist', async () => {
    await request(app)
      .get('/api/appointments/notfound')
      .expect(404);
  });
});

describe('GET /api/appointments/:date', () => {
  describe('in UTC', () => {
    it('returns a list of appointments occurring on the date', async () => {
      const response = await request(app)
        .get('/api/appointments/2018-04-06')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.appointments.length).toBe(2);
    });

    it('returns an empty array when no appointments exist on the date', async () => {
      const response = await request(app)
        .get('/api/appointments/2018-04-07')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.appointments.length).toBe(0);
    });
  });

  describe('in local time', () => {
    it('returns a list of appointments occurring on the date', async () => {
      const response = await request(app)
        .get('/api/appointments/2018-04-05?tz=America/Los_Angeles')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.appointments).toEqual([{
        id: '1',
        patientId: '1',
        firstName: 'Alek',
        lastName: 'Ziemann', 
        startTime: '2018-04-06T04:00:00Z',
        duration: 45
      }]);
    });

    it('returns bad request when timezone is invalid', async () => {
      await request(app)
        .get('/api/appointments/2018-04-05?tz=NotAReal/TimeZone')
        .expect(400);
    });
  });

  it('returns not found for invalid date', async () => {
    await request(app)
      .get('/api/appointments/2018-13-07')
      .expect(404);
  });
});

describe('POST /api/appointments', () => {
  it('creates a new appointment', async () => {
    await request(app)
      .post('/api/appointments')
      .send({ patientId: '2', startTime: '2018-08-06T18:00:00Z', duration: 30 })
      .expect(201)
      .expect({ id: '4', patientId: '2', firstName: 'Yasmin', lastName: 'Apt', startTime: '2018-08-06T18:00:00Z', duration: 30 });
  });

  it('returns bad request when request incorrectly formatted', async () => {
    await request(app)
      .post('/api/appointments')
      .send({ patientId: '2', startTime: '2018-08-06 18:00:00', duration: 'empty' })
      .expect(400);
  });
});

describe('PUT /api/appointments/:id', () => {
  it('updates an existing appointment', async () => {
    await request(app)
      .put('/api/appointments/2')
      .send({ id: '2', patientId: '2', startTime: '2018-08-06T18:00:00Z', duration: 30 })
      .expect(200)
      .expect({ id: '2', patientId: '2', firstName: 'Yasmin', lastName: 'Apt', startTime: '2018-08-06T18:00:00Z', duration: 30 });
  });

  it('returns bad request when request incorrectly formatted', async () => {
    await request(app)
      .put('/api/appointments/2')
      .send({ id: '2', patientId: '2', startTime: '2018-08-06 18:00:00', duration: 'empty' })
      .expect(400);
  });

  it('returns not found when appointment does not exist', async () => {
    await request(app)
      .put('/api/appointments/7')
      .send({ id: '7', patientId: '2', startTime: '2018-08-06 18:00:00Z', duration: 30 })
      .expect(404);
  });

  it('returns conflict when patient does not exist', async () => {
    await request(app)
      .put('/api/appointments/2')
      .send({ id: '2', patientId: '7', startTime: '2018-08-06 18:00:00Z', duration: 30 })
      .expect(409);
  });
});

describe('DELETE /api/appointments/:id', () => {
  it('returns no content when appointment deleted', async () => {
    await request(app)
      .delete('/api/appointments/3')
      .expect(204);
  });

  it('returns not found when appointment does not exist', async () => {
    await request(app)
      .delete('/api/appointments/notfound')
      .expect(404);
  });
});
