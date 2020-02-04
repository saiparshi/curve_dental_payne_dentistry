const sqlite = require('sqlite');

/**
 * Setup an in-memory sqlite database with a schema and some sample data
 * 
 * In a real application migrations might be used to execute DDL statements against
 * the database
 * 
 * Populates the global variable 'db' with a reference to the database.  This is required
 * to allow both jasmine and wallaby to setup the database before tests execute.
 */
exports.setup = async function() {
  global.db = await sqlite.open(':memory:', { Promise });
  await enableForeignKeys();
  await populatePatients();
  await populateAppointments();
  await populateBlockBookings();
};

async function enableForeignKeys() {
  await global.db.run('PRAGMA foreign_keys = true');
}

async function populatePatients() {
  await global.db.run(`
    CREATE TABLE patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      birth_date TEXT
  )`);
  for(const patient of PATIENTS) {
    await global.db.run(`
      INSERT INTO patients (id, first_name, last_name, birth_date)
      VALUES ($id, $firstName, $lastName, $birthDate)
      `, {
      $id: patient.id,
      $firstName: patient.firstName,
      $lastName: patient.lastName,
      $birthDate: patient.birthDate
    });
  }
}

async function populateAppointments() {
  await global.db.run(`
    CREATE TABLE appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      start_time TEXT,
      duration INTEGER,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    )`);
  for(const appointment of APPOINTMENTS) {
    const params = {
      $id: appointment.id,
      $patientId: appointment.patientId,
      $startTime: appointment.startTime,
      $duration: appointment.duration
    };
    await global.db.run(`
      INSERT INTO appointments (id, patient_id, start_time, duration)
      VALUES ($id, $patientId, $startTime, $duration)
    `, params);
  }
}

async function populateBlockBookings() {
  await global.db.run(`
    CREATE TABLE blockBookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      start_time TEXT,
      duration INTEGER,
      recurrence TEXT,
      end_date TEXT
    )`);
  for(const blockBooking of BLOCK_BOOKINGS) {
    const params = {
      $id: blockBooking.id,
      $description: blockBooking.description,
      $startTime: blockBooking.startTime,
      $duration: blockBooking.duration,
      $recurrence: blockBooking.recurrence,
      $endDate: blockBooking.endDate
    };
    await global.db.run(`
      INSERT INTO blockBookings (id, description, start_time, duration, recurrence, end_date)
      VALUES ($id, $description, $startTime, $duration, $recurrence, $endDate)
    `, params);
  }
}

const PATIENTS = [
  { id: 1, firstName: 'Alek', lastName: 'Ziemann', birthDate: '1973-03-05' },
  { id: 2, firstName: 'Yasmin', lastName: 'Apt', birthDate: '1964-05-13' },
  { id: 3, firstName: 'Lều', lastName: 'Pham', birthDate: '1947-07-21' }
];

const APPOINTMENTS = [
  { id: 1, patientId: 1, startTime: '2018-04-06T04:00:00Z', duration: 45 },
  { id: 2, patientId: 2, startTime: '2018-04-06T20:00:00Z', duration: 30 },
  { id: 3, patientId: 2, startTime: '2017-11-30T13:00:00Z', duration: 45 }
];

const BLOCK_BOOKINGS = [
  { id: 1, description:'Doctor Appointment', startTime: '2018-10-17T10:00:00Z', duration: 60, recurrence:'', endDate: ''},
  { id: 2, description:'Tee Time', startTime: '2018-08-13T15:00:00Z', duration: 240, recurrence:'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR', endDate: '2018-09-19'},
  { id: 3, description:'Early Friday Close', startTime: '2018-06-24T13:00:00Z', duration: 300, recurrence:'RRULE:FREQ=WEEKLY;BYDAY=FR', endDate: ''}
];
