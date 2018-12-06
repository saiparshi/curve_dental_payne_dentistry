const request = require('supertest');

const app = require('../server');

describe('GET /api/patients', () => {
  it('returns a list of patients', async () => {
    const response = await request(app)
      .get('/api/patients')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.patients.length).toBeGreaterThan(1);
  });
});

describe('GET /api/patients/:id', () => {
  it('returns a specific patient', async () => {
    await request(app)
      .get('/api/patients/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({id: '1', firstName: 'Alek', lastName: 'Ziemann', birthDate: '1973-03-05'});
  });

  it('returns not found when retrieved patient does not exist', async () => {
    await request(app)
      .get('/api/patients/notfound')
      .expect(404);
  });
});

describe('PUT /api/patients/:id', () => {
  it('updates a patient with a PUT to the request id and returns the updated patient', async () => {
    await request(app)
      .put('/api/patients/2')
      .send({id:'2', firstName: 'Yasmin', lastName: 'Apte', birthDate: '1964-05-13'})
      .expect(200)
      .expect({id: '2', firstName: 'Yasmin', lastName: 'Apte', birthDate: '1964-05-13'});
  });

  it('returns not found when updated patient does not exist', async () => {
    await request(app)
      .put('/api/patients/99999')
      .send({id:'99999', firstName: 'Yasmin', lastName: 'Apte', birthDate: '1964-05-13'})
      .expect(404);
  });

  it('returns bad request when request incorrectly formatted', async () => {
    await request(app)
      .put('/api/patients/3')
      .send({id: '4', firstName: '', lastName: '', birthDate: '1927-09-31'})
      .expect(400);
  });
});

describe('POST /api/patients', () => {
  it('creates a new patient', async () => {
    await request(app)
      .post('/api/patients')
      .send({firstName: 'Mikołaj', lastName: 'Borkowski', birthDate: '1927-09-18'})
      .expect(201)
      .expect({ id: '4', firstName: 'Mikołaj', lastName: 'Borkowski', birthDate: '1927-09-18'});
  });

  it('returns bad request when request incorrectly formatted', async () => {
    await request(app)
      .post('/api/patients')
      .send({firstName: '', lastName: '', birthDate: '1927-09-31'})
      .expect(400);
  });
});

describe('DELETE /api/patients/:id', () => {
  it('returns not found when deleted patient does not exist', async () => {
    await request(app)
      .delete('/api/patients/notfound')
      .expect(404);
  });

  it('delete an existing patient', async () => {
    await request(app)
      .delete('/api/patients/3')
      .expect(200);
  });
});