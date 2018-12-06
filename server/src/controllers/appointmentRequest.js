const moment = require('moment');

/**
 * Parses and validates an HTTP request body to ensure it is a correctly formed request
 * to create or update an appointment.
 */
class AppointmentRequest {
  constructor(id, body) {
    let messages = this.getValidationMessages(id, body);
    if (messages.length) {
      const error = new Error('Request contains one or more validation errors');
      error.messages = messages;
      throw error;
    }
 
    this._appointment = {};
    if (id) {
      this._appointment.id = id;
    }
    this._appointment.patientId = body.patientId;
    this._appointment.startTime = moment.utc(body.startTime);
    this._appointment.duration = body.duration;
  }

  get appointment() {
    return this._appointment;
  }

  getValidationMessages(id, body) {
    let errors = [];

    if (body.id) {
      if (!id) {
        errors.push('new appointment must not have an id');
      } else if (id !== body.id) {
        errors.push(`updated appointment id in body '${body.id}' does not match resource '${id}'`);
      }
    }

    if (!body.patientId) {
      errors.push('appointment must have a patientId');
    }

    if (!body.startTime) {
      errors.push('appointment must have a startTime');
    } else {
      let utcDate = moment.utc(body.startTime, moment.ISO_8601, true);
      let localDate = moment(body.startTime, moment.ISO_8601, true);
      if (!utcDate.isValid()) {
        errors.push(`appointment startTime '${body.startTime}' is not a valid ISO-8601 date`);
      } else if (utcDate.toISOString() !== localDate.toISOString()) {
        errors.push(`appointment startTime '${body.startTime}' must be in UTC or have an offset`);
      }
    }

    if (Number(body.duration) !== body.duration || !Number.isInteger(Number(body.duration))) {
      errors.push('appointment must have a integer duration');
    } else {
      if (body.duration < 0) {
        errors.push(`appointment duration '${body.duration}' must be positive`);
      }
    }

    return errors;
  }
}

/**
 * Construct a AppointmentRequest object from a request to create a new appointment
 * 
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forCreate(body) {
  return new AppointmentRequest(null, body);
}

/**
 * Construct a AppointmentRequest object from a request to update an existing appointment 
 * 
 * @param {string} id - appointment id from the resource URI
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forUpdate(id, body) {
  return new AppointmentRequest(id, body);
}

module.exports = {
  forCreate,
  forUpdate
};
