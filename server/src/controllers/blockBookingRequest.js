const moment = require('moment');

/**
 * Parses and validates an HTTP request body to ensure it is a correctly formed request
 * to create or update a blockBooking.
 */
class BlockBookingRequest {
  constructor(id, body) {
    let messages = this.getValidationMessages(id, body);
    if (messages.length) {
      const error = new Error('Request contains one or more validation errors');
      error.messages = messages;
      throw error;
    }
 
    this._blockBooking = {};
    if (id) {
      this._blockBooking.id = id;
    }
    this._blockBooking.description = body.description;
    this._blockBooking.startTime = moment.utc(body.startTime);
    this._blockBooking.duration = body.duration;
    this._blockBooking.recurrence = body.recurrence;
    this._blockBooking.endDate = body.endDate;
  }

  get blockBooking() {
    return this._blockBooking;
  }

  getValidationMessages(id, body) {
    let errors = [];

    if (body.id) {
      if (!id) {
        errors.push('new blockBooking must not have an id');
      } else if (id !== body.id) {
        errors.push(`updated blockBooking id in body '${body.id}' does not match resource '${id}'`);
      }
    }

    if(!body.description){
      errors.push('blockBooking must have a description');
    }

    if (!body.startTime) {
      errors.push('blockBooking must have a startTime');
    } else {
      let utcDate = moment.utc(body.startTime, moment.ISO_8601, true);
      let localDate = moment(body.startTime, moment.ISO_8601, true);
      if (!utcDate.isValid()) {
        errors.push(`blockBooking startTime '${body.startTime}' is not a valid ISO-8601 date`);
      } else if (utcDate.toISOString() !== localDate.toISOString()) {
        errors.push(`blockBooking startTime '${body.startTime}' must be in UTC or have an offset`);
      }
    }

    if (Number(body.duration) !== body.duration || !Number.isInteger(Number(body.duration))) {
      errors.push('blockBooking must have a integer duration');
    } else {
      if (body.duration < 0) {
        errors.push(`blockBooking duration '${body.duration}' must be positive`);
      }
    }

    if(!body.recurrence && body.endDate){
      errors.push('blockBooking must have a end date only for recurring event');
    }else if(body.endDate){
      let endDate = moment(body.endDate, 'YYYY-MM-DD', true);
      if (!endDate.isValid()) {
        errors.push(`blockBooking endDate '${body.endDate}' is not a valid YYYY-MM-DD date`);
      } 
    }

    return errors;
  }
}

/**
 * Construct a blockBookingRequest object from a request to create a new blockBooking
 * 
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forCreate(body) {
  return new BlockBookingRequest(null, body);
}

/**
 * Construct a blockBookingRequest object from a request to update an existing blockBooking 
 * 
 * @param {string} id - blockBooking id from the resource URI
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forUpdate(id, body) {
  return new BlockBookingRequest(id, body);
}

module.exports = {
  forCreate,
  forUpdate
};
