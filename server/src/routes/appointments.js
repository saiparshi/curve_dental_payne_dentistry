const express = require('express');
const router = express.Router();

const appointments_controller = require('../controllers/appointmentsController');

/**
 * @api { get } /api/appointments/:date Retrieve list of appointments on a date 
 * 
 * @apiParam { string } date Date if format YYYY-MM-DD
 * @apiParam { string } tz Timezone is format Region/Zone according to tz database
 *     Optional.  Defaults to Etc/UTC if not present.
 *
 * @apiSuccess { appointments: [] } appointments Array of appointment objects
 * @apiExample Retrieve all appointments on Aug 6, 2018 MDT
 *     http://localhost:3000/api/appointments/2018-08-06?tz=America/Edmonton
 */
router.get('/:date(\\d{4}-\\d{2}-\\d{2})/', appointments_controller.appointments_showByDate);

/**
 * @api { get } /api/appointments/:id Retrieve specific appointment by id
 * 
 * @apiParam { string } id Apointment's unique ID 
 */
router.get('/:id', appointments_controller.appointments_showById);

/**
 * @api { put } /api/appointments/:id Update a specific appointment by id
 *
 * @apiParam { string } id Appointment's unique ID 
 */
router.put('/:id', appointments_controller.appointments_update);

/**
 * @api { delete } /api/appointments/:date Delete specific appointment by id
 * 
 * @apiParam { string } id Apointment's unique ID 
 */
router.delete('/:id', appointments_controller.appointments_delete);

/**
 * @api { get } /api/appointments Retrieve list of all appointments
 * 
 * @apiSuccess { appointments: [] } appointments Array of appointment objects
 */
router.get('/', appointments_controller.appointments_list);

/**
 * @api { post } /api/appointments Create a new appointment 
 * @apiParamExample { json } Request-Example:
 *     {
 *         "patientId": "7",
 *         "startTime": "2018-08-06T18:00:00Z",
 *         "duration": 30 
 *     }
 * @apiSuccessExample { json } Success-Response:
 *     {
 *         "id": "4",
 *         "patientId": "7",
 *         "firstName": "Marjorie",
 *         "lastName": "Brown",
 *         "startTime": "2018-08-06T18:00:00Z",
 *         "duration": 30 
 *     }
 */
router.post('/', appointments_controller.appointments_create);

module.exports = router;