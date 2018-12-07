'use strict';

const ScheduleService = require('../services/schedule-service');
const express = require('express');
const Authenticated = require('../middlewares/authenticated');

let api = express.Router();

api.route('/schedule')
  .post(Authenticated.ensureAuth, ScheduleService.saveSchedule)
  .get(Authenticated.ensureAuth, ScheduleService.getPersonsSchedules);

// api.route('/schedule/day')
//   .get(Authenticated.ensureAuth, ScheduleService.getHorasExtrasPorDia);
//
// api.route('/schedule/week')
//   .get(Authenticated.ensureAuth, ScheduleService.getHorasExtrasPorSemana);

api.route('/schedule/hours')
  .get(Authenticated.ensureAuth, ScheduleService.getHorasExtras);
  
api.route('/schedule/report')
  .get(ScheduleService.reporteMensual);

module.exports = api;
