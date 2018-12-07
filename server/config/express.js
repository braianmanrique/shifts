'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const AuthRoute = require('../routes/auth-route');
const LocationRoute = require('../routes/location-route');
const CategoryRoute = require('../routes/category-route');
const PersonRoute = require('../routes/person-route');
const RoleRoute = require('../routes/role-route');
const ScheduleRoute = require('../routes/schedule-route');
const app = express();

app.use(cors());
app.use(morgan('dev'));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/*Se usa la ruta /api para todos los servicios que exponga la aplicación*/
app.use('/api', AuthRoute);
app.use('/api', LocationRoute);
app.use('/api', CategoryRoute);
app.use('/api', PersonRoute);
app.use('/api', RoleRoute);
app.use('/api', ScheduleRoute);

// Point static path to dist
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

module.exports = app;
