'use strict';

const PersonService = require('../services/person-service');
const Authenticated = require('../middlewares/authenticated');
const express = require('express');
let api = express.Router();

/* GET api listing. */
api.route('/person')
  .post(Authenticated.ensureAuth, PersonService.savePerson)
  .get(Authenticated.ensureAuth, PersonService.getPersons);

api.route('/persons')
  .get(Authenticated.ensureAuth, PersonService.getPersonsFor);

module.exports = api;
