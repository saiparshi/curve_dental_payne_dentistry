/**
 * Read and delete routes for appointments.  Create and update left as an exercise to the reader.
 */

const moment = require('moment-timezone');
const appointments = require('../models/appointments');
const { forCreate, forUpdate } = require('./appointmentRequest');

exports.appointments_list = async function (_, res) {
  const allAppointments = await appointments.getAll();
  res.status(200).json({appointments: allAppointments.map(mapToHttp)});
};

exports.appointments_showById = async function (req, res) {
  const appointment = await appointments.get(req.params.id);
  if (appointment) {
    return res.status(200).json(mapToHttp(appointment));
  }
  res.status(404).send();
};

/**
 * Returns a list of all appointments occurring within a single day where
 * the start and end of the day are defined by the tz query parameter.  Defaults
 * to Etc/UTC where tz is not present.
 */
exports.appointments_showByDate = async function (req, res) {
  const tz = req.query.tz || 'Etc/UTC';
  if (!moment.tz.zone(tz)) {
    return res.status(400).send();
  }

  const date = moment.tz(req.params.date, 'YYYY-MM-DD', true, tz);
  if (!date.isValid()) {
    return res.status(404).send();
  }

  const appointmentsOnDay = await appointments.getBetween(date, date.clone().add(1, 'day'));
  return res.status(200).json({ appointments: appointmentsOnDay.map(mapToHttp) });
};

exports.appointments_create = async function (req, res) {
  try {
    const request = forCreate(req.body);
    let appointment = await appointments.create(request.appointment);
    return res.status(201).json(mapToHttp(appointment));
  } catch (err) {
    return res.status(400).send();
  }
};

exports.appointments_update = async function (req, res) {
  let request = null;
  try {
    request = forUpdate(req.params.id, req.body);
  } catch (err) {
    return res.status(400).send();
  }

  try {
    let appointment = await appointments.update(request.appointment);
    return res.status(200).json(mapToHttp(appointment));
  } catch (err) {
    if (/no patient with id/.test(err.message)) {
      return res.status(409).send();
    } 
    return res.status(404).send();
  }
};

exports.appointments_delete = async function(req, res) {
  try {
    await appointments.delete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).send();
  }
};

function mapToHttp(appointment) {
  return {
    id: appointment.id,
    patientId: appointment.patientId,
    firstName: appointment.firstName,
    lastName: appointment.lastName,
    startTime: appointment.startTime.format('YYYY-MM-DDTHH:mm:ss\\Z'),
    duration: appointment.duration
  };
}