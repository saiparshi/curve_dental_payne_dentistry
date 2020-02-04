const express = require('express');
const router = express.Router();

const blockBookings_controller = require('../controllers/blockBookingsController');

/**
 * @api { get } /api/blockBookings/:date Retrieve list of blockBookings on a date 
 * 
 * @apiParam { string } date Date if format YYYY-MM-DD
 * @apiParam { string } tz Timezone is format Region/Zone according to tz database
 *     Optional.  Defaults to Etc/UTC if not present.
 *
 * @apiSuccess { blockBookings: [] } blockBookings Array of appointment objects
 * @apiExample Retrieve all blockBookings on Aug 6, 2018 MDT
 *     http://localhost:3000/api/blockBookings/2018-08-06?tz=America/Edmonton
 */
router.get('/:date(\\d{4}-\\d{2}-\\d{2})/', blockBookings_controller.blockBookings_showByDate);

/**
 * @api { get } /api/blockBookings/:id Retrieve specific appointment by id
 * 
 * @apiParam { string } id Apointment's unique ID 
 */
router.get('/:id', blockBookings_controller.blockBookings_showById);

/**
 * @api { put } /api/blockBookings/:id Update a specific appointment by id
 *
 * @apiParam { string } id Appointment's unique ID 
 */
router.put('/:id', blockBookings_controller.blockBookings_update);

/**
 * @api { delete } /api/blockBookings/:date Delete specific appointment by id
 * 
 * @apiParam { string } id Apointment's unique ID 
 */
router.delete('/:id', blockBookings_controller.blockBookings_delete);

/**
 * @api { get } /api/blockBookings Retrieve list of all blockBookings
 * 
 * @apiSuccess { blockBookings: [] } blockBookings Array of appointment objects
 */
router.get('/', blockBookings_controller.blockBookings_list);

/**
 * @api { post } /api/blockBookings Create a new appointment 
 * @apiParamExample { json } Request-Example:
 *     {
 *         "startTime": "2018-08-06T18:00:00Z",
 *         "duration": 30
 *     }
 * @apiSuccessExample { json } Success-Response:
 *     {
 *         "id": "4",
 *         "startTime": "2018-08-06T18:00:00Z",
 *         "duration": 30 
 *     }
 */
router.post('/', blockBookings_controller.blockBookings_create);

module.exports = router;