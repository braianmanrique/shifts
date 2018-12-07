'use strict';

const RolesService = require('../services/role-service');
const Authenticated = require('../middlewares/authenticated');
const express = require('express');
let api = express.Router();

api.route('/role')
  .get(Authenticated.ensureAuth, RolesService.getRoles);

module.exports = api;
