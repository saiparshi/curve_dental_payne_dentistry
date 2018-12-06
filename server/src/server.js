const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');
const path = require('path');
const compression = require('compression');

const port = process.env.port || '3000';

app.use(compression());

// Serve the bundled JavaScript produced by the Angular build.
// This directory is empty when Angular is served via the webpack
// dev server
app.use(express.static('../dist/payne-dentistry'));

app.use(bodyParser.json({expose: true}));

app.use('/api/patients', patientsRouter);
app.use('/api/appointments', appointmentsRouter);

// All other requests to /api return a 404, all other requests to
// anything but /api return index.html to enable linking directly to
// client-side routes
app.use('/api/*', (_, res) => {
  res.status(404).send();
});
app.get('/*', (req, res) => {
  const indexPath = path.resolve(__dirname, '../../dist/payne-dentistry/index.html');
  res.sendFile(indexPath);
});

// Allows the server to be tested using supertest.  When supertest is running the
// server.js is loaded but the application should not start listening on a port
// or setup the connection to the production database.
const isRunningAsPartOfTests = !!module.parent;
if (!isRunningAsPartOfTests) {
  require('../spec/support/database').setup();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
} 
 
module.exports = app;
