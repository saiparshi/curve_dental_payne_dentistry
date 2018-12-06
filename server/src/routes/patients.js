const express = require('express');
const router = express.Router();

const patientsController = require('../controllers/patientsController');

/**
 * @api { get } /api/patients/:id Retrieve specific patient by id
 *
 * @apiParam { string } id Patient's unique ID 
 */
router.get('/:id', patientsController.patients_show);

/**
 * @api { put } /api/patients/:id Update a specific patient by id
 *
 * @apiParam { string } id Patient's unique ID 
 */
router.put('/:id', patientsController.patients_update);

/**
 * @api { delete } /api/patients/:id Delete a specific patient by id
 *
 * @apiParam { string } id Patient's unique ID 
 */
router.delete('/:id', patientsController.patients_delete);

/**
 * @api { get } /api/patients Retrieve an array of all patients
 *
 * @apiSuccess { patients: [] } patients Array of patient objects
 */
router.get('/', patientsController.patients_list);

/**
 * @api { post } /api/patients Create a new patient
 * @apiParamExample { json } Request-Example:
 *     {
 *         "firstName": "Mary",
 *         "lastName": "Smith",
 *         "birthDate": "1956-03-02"
 *     }
 * @apiSuccessExample { json } Success-Response:
 *     {
 *         "id": "7",
 *         "firstName": "Mary",
 *         "lastName": "Smith",
 *         "birthDate": "1956-03-02"
 *     }
 */
router.post('/', patientsController.patients_create);

module.exports = router;