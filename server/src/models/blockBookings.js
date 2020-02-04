const database = require('./database');
const moment = require('moment');

/**
 * Persistence layer for blockBookings
 * 
 * This class is responsible for mapping between the string type of the blockBooking id
 * and the internal integer representation in the database.
 */

/**
 * @returns { BlockBooking[] } Array of all blockBookings
 */
exports.getAll = async () => {
  const db = database.getDatabase();

  const rows = await db.all(BLOCK_BOOKINGS_QUERY);
  return rows.map(mapRowToBlockBooking);
};

/**
 * @param { string } id BlockBooking's unique ID
 * @returns { BlockBooking }
 */
exports.get = async (id) => {
  const db = database.getDatabase();

  const row = await db.get(BLOCK_BOOKINGS_QUERY + BLOCK_BOOKINGS_FILTER_BY_ID, { $id: +id });
  if (!row) {
    return null;
  }
  return mapRowToBlockBooking(row);
};

/**
 * Return all blockBookings whose start time is in the half-open range [start, end) where start
 * and end are both in UTC.
 * 
 * @param { Moment } start Start time in UTC
 * @param { Moment } end End time in UTC
 * @returns { BlockBooking[] } Array of all blockBookings starting between [start, end)
 */
exports.getBetween = async (start, end) => {
  const db = database.getDatabase();

  const rows = await db.all(
    BLOCK_BOOKINGS_QUERY + BLOCK_BOOKINGS_FILTER_BY_TIME,
    { $start: start.utc().format(), $end: end.utc().format() }
  );
  return rows.map(mapRowToBlockBooking);
};

/**
 * @param { BlockBooking } blockBooking to create
 * @returns { BlockBooking } Created blockBooking object with id set
 */
exports.create = async (blockBooking) => {
  const db = database.getDatabase();
  let result = await db.run(
    'INSERT INTO blockBookings ( description, start_time, duration, recurrence, end_date) VALUES ($description, $startTime, $duration, $recurrence, $endDate)', {
      $description: blockBooking.description,
      $startTime: blockBooking.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
      $duration: blockBooking.duration,
      $recurrence: blockBooking.recurrence,
      $endDate: blockBooking.endDate
    }
  );
  if (!result.lastID) {
    throw new Error('Failed to create blockBooking');
  }
  blockBooking.id = '' + result.lastID;
  return exports.get('' + result.lastID);
};

/**
 * @param { BlockBooking } blockBooking BlockBooking to update based upon blockBooking's id
 * @returns { BlockBooking } Updated BlockBooking object
 * @throws If no BlockBooking with id exists
 */
exports.update = async (blockBooking) => {
  const db = database.getDatabase();
  let result = null;
  try {
    result = await db.run(
      `UPDATE blockBookings
     SET
       description = $description, 
       start_time = $startTime,
       duration = $duration,
       recurrence = $recurrence,
       end_date = $endDate 
     WHERE
       id = $id
    `, {
        $id: +blockBooking.id,
        $description: blockBooking.description,
        $startTime: blockBooking.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
        $duration: blockBooking.duration,
        $recurrence: blockBooking.recurrence,
        $endDate: blockBooking.endDate
      }
    );
  } catch (err) {
    if (/SQLITE_CONSTRAINT/.test(err.message)) {
      throw new Error(`Failed to update blockBooking with id '${blockBooking.id}'`);
    }
    throw err;
  }
  if (!result.changes) {
    throw new Error(`Failed to update blockBooking with id '${blockBooking.id}'`);
  }
  return exports.get(blockBooking.id);
};

/**
 * @param { string } id blockBooking's unique ID
 */
exports.delete = async (id) => {
  const db = database.getDatabase();

  const row = await db.run('DELETE FROM blockBookings WHERE id = $id', +id);
  if (!row.changes) {
    throw new Error(`Failed to delete blockBooking id '${id}'`);
  }
};

const BLOCK_BOOKINGS_QUERY = ` 
    SELECT 
      blockBookings.id AS id,
      description,
      start_time,
      duration,
      recurrence,
      end_date
    FROM
      blockBookings
    `;

const BLOCK_BOOKINGS_FILTER_BY_ID = 'WHERE blockBookings.id = $id';
const BLOCK_BOOKINGS_FILTER_BY_TIME = 'WHERE start_time >= $start AND start_time < $end';

function mapRowToBlockBooking(row) {
  return {
    id: '' + row.id,
    description: row.description,
    startTime: moment.utc(row.start_time),
    duration: row.duration,
    recurrence: row.recurrence,
    endDate: row.end_date
  };
}
