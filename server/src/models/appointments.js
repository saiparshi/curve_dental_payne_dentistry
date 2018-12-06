const database = require('./database');
const moment = require('moment');

/**
 * Persistence layer for appointments
 * 
 * This class is responsible for mapping between the string type of the appointment id
 * and the internal integer representation in the database.
 */

/**
 * @returns { Appointment[] } Array of all appointments
 */
exports.getAll = async () => {
  const db = database.getDatabase();

  const rows = await db.all(APPOINTMENT_QUERY);
  return rows.map(mapRowToAppointment);
};

/**
 * @param { string } id Appointment's unique ID
 * @returns { Appointment }
 */
exports.get = async (id) => {
  const db = database.getDatabase();

  const row = await db.get(APPOINTMENT_QUERY + APPOINTMENT_FILTER_BY_ID, { $id: +id });
  if (!row) {
    return null;
  }
  return mapRowToAppointment(row);
};

/**
 * Return all appointments whose start time is in the half-open range [start, end) where start
 * and end are both in UTC.
 * 
 * @param { Moment } start Start time in UTC
 * @param { Moment } end End time in UTC
 * @returns { Appointment[] } Array of all appointments starting between [start, end)
 */
exports.getBetween = async (start, end) => {
  const db = database.getDatabase();

  const rows = await db.all(
    APPOINTMENT_QUERY + APPOINTMENT_FILTER_BY_TIME,
    { $start: start.utc().format(), $end: end.utc().format() }
  );
  return rows.map(mapRowToAppointment);
};

/**
 * @param { Appointment } appointment Appointment to create
 * @returns { Appointment } Created appointment object with id set
 */
exports.create = async (appointment) => {
  const db = database.getDatabase();
  let result = await db.run(
    'INSERT INTO appointments (patient_id, start_time, duration) VALUES ($patientId, $startTime, $duration)', {
      $patientId: +appointment.patientId,
      $startTime: appointment.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
      $duration: appointment.duration
    }
  );
  if (!result.lastID) {
    throw new Error('Failed to create appointment');
  }
  appointment.id = '' + result.lastID;
  return exports.get('' + result.lastID);
};

/**
 * @param { Appointment } appointment Appointment to update based upon appointment's id
 * @returns { Appointment } Updated appointment object
 * @throws If no appointment or patient exists with id
 */
exports.update = async (appointment) => {
  const db = database.getDatabase();
  let result = null;
  try {
    result = await db.run(
      `UPDATE appointments
     SET
       patient_id = $patientId,
       start_time = $startTime,
       duration = $duration
     WHERE
       id = $id
    `, {
        $id: +appointment.id,
        $patientId: +appointment.patientId,
        $startTime: appointment.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
        $duration: appointment.duration 
      }
    );
  } catch (err) {
    if (/SQLITE_CONSTRAINT/.test(err.message)) {
      throw new Error(`Failed to update appointment with id '${appointment.id}', no patient with id '${appointment.patientId}'`);
    }
    throw err;
  }
  if (!result.changes) {
    throw new Error(`Failed to update appointment with id '${appointment.id}'`);
  }
  return exports.get(appointment.id);
};

/**
 * @param { string } id Appointment's unique ID
 */
exports.delete = async (id) => {
  const db = database.getDatabase();

  const row = await db.run('DELETE FROM appointments WHERE id = $id', +id);
  if (!row.changes) {
    throw new Error(`Failed to delete appointment id '${id}'`);
  }
};

const APPOINTMENT_QUERY = ` 
    SELECT 
      appointments.id AS id,
      patient_id,
      first_name,
      last_name,
      start_time,
      duration
    FROM
      appointments
    INNER JOIN
      patients ON patients.id = appointments.patient_id
    `;

const APPOINTMENT_FILTER_BY_ID = 'WHERE appointments.id = $id';
const APPOINTMENT_FILTER_BY_TIME = 'WHERE start_time >= $start AND start_time < $end';

function mapRowToAppointment(row) {
  return {
    id: '' + row.id,
    patientId: '' + row.patient_id,
    firstName: row.first_name,
    lastName: row.last_name,
    startTime: moment.utc(row.start_time),
    duration: row.duration
  };
}
