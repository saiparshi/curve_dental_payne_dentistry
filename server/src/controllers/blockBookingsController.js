/**
 * Read and delete routes for blockBookings.
 */

const moment = require('moment-timezone');
const blockBookings = require('../models/blockBookings');
const { forCreate, forUpdate } = require('./blockBookingRequest');

exports.blockBookings_list = async function (_, res) {
  const allBlockBookings = await blockBookings.getAll();
  res.status(200).json({blockBookings: allBlockBookings});
};

exports.blockBookings_showById = async function (req, res) {
  const blockBooking = await blockBookings.get(req.params.id);
  if (blockBooking) {
    return res.status(200).json(mapToHttp(blockBooking));
  }
  res.status(404).send();
};

/**
 * Returns a list of all blockBookings occurring within a single day where
 * the start and end of the day are defined by the tz query parameter.  Defaults
 * to Etc/UTC where tz is not present.
 */
exports.blockBookings_showByDate = async function (req, res) {
  const tz = req.query.tz || 'Etc/UTC';
  if (!moment.tz.zone(tz)) {
    return res.status(400).send();
  }

  const date = moment.tz(req.params.date, 'YYYY-MM-DD', true, tz);
  if (!date.isValid()) {
    return res.status(404).send();
  }

  const blockBookingsOnDay = await blockBookings.getBetween(date, date.clone().add(1, 'day'));
  return res.status(200).json({ blockBookings: blockBookingsOnDay.map(mapToHttp) });
};

exports.blockBookings_create = async function (req, res) {
  try {
    const request = forCreate(req.body);
    let blockBooking = await blockBookings.create(request.blockBooking);
    return res.status(201).json(mapToHttp(blockBooking));
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

exports.blockBookings_update = async function (req, res) {
  let request = null;
  try {
    request = forUpdate(req.params.id, req.body);
  } catch (err) {
    return res.status(400).send(err.messages);
  }

  try {
    let blockBooking = await blockBookings.update(request.blockBooking);
    return res.status(200).json(mapToHttp(blockBooking));
  } catch (err) {
    if (/no block bookings with id/.test(err.message)) {
      return res.status(409).send();
    } 
    return res.status(404).send(err.messages);
  }
};

exports.blockBookings_delete = async function(req, res) {
  try {
    await blockBookings.delete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).send();
  }
};

function mapToHttp(blockBooking) {
  return {
    id: blockBooking.id,
    description: blockBooking.description,
    startTime: blockBooking.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
    duration: blockBooking.duration,
    recurrence: blockBooking.recurrence,
    endDate: blockBooking.endDate
  };
}