'use strict';

const AuthService = require('../services/auth-service');
const express = require('express');
let api = express.Router();

/* GET api listing. */
api.route('/login')
  .post(AuthService.login);

module.exports = api;
