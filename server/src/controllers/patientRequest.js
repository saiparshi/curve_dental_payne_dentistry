const moment = require('moment');

/**
 * Parses and validates an HTTP request body to ensure it is a correctly formed request
 * to create a patient.
 */
class PatientRequest {
  constructor(id, body) {
    let messages = this.getValidationMessages(id, body);
    if (messages.length) {
      const error = new Error('Create patient request contains one or more validation errors');
      error.messages = messages;
      throw error;
    }
 
    this._patient = {};
    if (id) {
      this._patient.id = id;
    }
    this._patient.firstName = body.firstName;
    this._patient.lastName = body.lastName;
    this._patient.birthDate = body.birthDate;
  }

  get patient() {
    return this._patient;
  }

  getValidationMessages(id, body) {
    let errors = [];

    if (body.id) {
      if (!id) {
        errors.push('new patient must not have an id');
      } else if (id !== body.id) {
        errors.push(`updated patient id in body '${body.id}' does not match resource '${id}'`);
      }
    }

    if (!body.firstName) {
      errors.push('patient must have a first name');
    }

    if (!body.lastName) {
      errors.push('patient must have a last name');
    }

    if (!body.birthDate) {
      errors.push('patient must have a birth date');
    } else {
      let date = moment(body.birthDate, 'YYYY-MM-DD', true);
      if (!date.isValid()) {
        errors.push(`patient birth date '${body.birthDate}' is not a valid date`);
      }
    }

    return errors;
  }
}

/**
 * Construct a PatientRequest object from a request to create a new patient
 * 
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forCreate(body) {
  return new PatientRequest(null, body);
}

/**
 * Construct a PatientRequest object from a request to create a new patient
 * 
 * @param {string} id - patient id from the resource URI
 * @param {Object} body - An HTTP request body
 * @throws if the request is not correctly formed
 */
function forUpdate(id, body) {
  return new PatientRequest(id, body);
}

module.exports = {
  forCreate,
  forUpdate
};
