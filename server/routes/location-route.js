'use strict';

const LocationService = require('../services/location-service');
const express = require('express');
const Authenticated = require('../middlewares/authenticated');

let api = express.Router();

/* GET api listing. */
api.route('/location')
  .post(Authenticated.ensureAuth, LocationService.saveLocation)
  .get(Authenticated.ensureAuth, LocationService.getLocations);

module.exports = api;
