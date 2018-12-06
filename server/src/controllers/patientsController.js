const patients = require('../models/patients');
const { forCreate, forUpdate } = require('./patientRequest');

exports.patients_list = async function (_, res) {
  let allPatients = await patients.getAll();
  res.status(200).json({patients: allPatients});
};

exports.patients_show = async function (req, res) {
  let patient = await patients.get(req.params.id);
  if (patient) {
    return res.status(200).json(patient);
  }
  res.status(404).send();
};

exports.patients_update = async function (req, res) {
  let request;
  try {
    request = forUpdate(req.params.id, req.body);
  } catch (err) {
    return res.status(400).send();
  }

  try {
    const patient = await patients.update(request.patient);
    return res.status(200).send(patient);
  } catch (err) {
    res.status(404).send();
  }
};

exports.patients_create = async function (req, res) {
  try {
    const request = forCreate(req.body);
    const patient = await patients.create(request.patient);
    return res.status(201).json(patient);
  } catch (err) {
    res.status(400).send();
  }
};

exports.patients_delete = async function (req, res) {
  try {
    await patients.delete(req.params.id);
    return res.status(200).send();
  } catch (err) {
    res.status(404).send();
  }
};