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
