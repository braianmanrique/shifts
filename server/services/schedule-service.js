'use strict';

const moment = require('moment');
const Schedule = require('../models/schedule');
const ScheduleLogic = require('../bll/schedule');

let saveSchedule = (req, res) => {
  if (req.body) {
    let schedule = new Schedule(req.body);

    if (req.body._id) {
      ScheduleLogic
        .editSchedule(req.user, schedule)
        .then((scheduleEdited) => {
          res.status(200).send({
            message: 'Operacion exitosa',
            schedule: scheduleEdited
          });
        })
        .catch((err) => {
          res.status(400).send({
            message: 'Error editando Schedule: ' + err
          });
        });
    } else {
      ScheduleLogic
        .saveSchedule(req.user, schedule)
        .then((scheduleSaved) => {
          res.status(200).send({
            message: "Operacion exitosa",
            schedule: scheduleSaved
          });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  }
};

let getPersonsSchedules = (req, res) => {
  let query = {};
  if(req.query.date){
    let momentDate = moment(req.query.date);
    query.day = momentDate.date();
    query.month = momentDate.month() + 1;
    query.year = momentDate.year();
  }else if(req.query.beginDate && req.query.endDate){
    let momentBeginDate = moment(req.query.beginDate);
    let momentEndDate = moment(req.query.endDate);
    query.beginDay = momentBeginDate.date();
    query.beginMonth = momentBeginDate.month() + 1;
    query.beginYear = momentBeginDate.year();
    query.endDay = momentEndDate.date();
    query.endMonth = momentEndDate.month() + 1;
    query.endYear = momentEndDate.year();
  }

  if(req.query.locationId){
    query.location = req.query.locationId;
  }

  if(req.query.categoryId){
    query.category = req.query.categoryId;
  }
  
  if (req.query.active){
    query.active = true;
  }

  console.log("query ", query);

  ScheduleLogic
    .getPersonsSchedules(req.user, query)
    .then((persons) => {
      return res.status(200).send(persons);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({
        message:err
      });
    });
};

let getHorasExtrasPorDia = (req, res) => {
  let query = {};
  if (req.query.date){
    query.date = req.query.date;
    if (req.query.locationId){
      query.locationId = req.query.locationId;
    }
    if (req.query.categoryId){
      query.categoryId = req.query.categoryId;
    }
    ScheduleLogic
      .getHorasExtrasPorDia(req.user, query)
      .then((persons) => {
        return res.status(200).send(persons);
      })
      .catch((err) => {
        return res.status(400).send({
          message: err
        });
      });
  }else{
    return res.status(400).send({
      message: 'No se envió un día  para consultar las horas extras'
    });
  }
};

let getHorasExtrasPorSemana = (req, res) => {
  let query = {};
  if (req.query.beginDate && req.query.endDate){
    query.beginDate = req.query.beginDate;
    query.endDate = req.query.endDate;
    if (req.query.locationId){
      query.locationId = req.query.locationId;
    }
    if (req.query.categoryId){
      query.categoryId = req.query.categoryId;
    }
    ScheduleLogic
      .getHorasExtrasPorSemana(req.user, query)
      .then((persons) => {
        return res.status(200).send(persons);
      })
      .catch((err) => {
        return res.status(400).send({
          message: err
        });
      });
  }else{
    return res.status(400).send({
      message: 'No se enviaron día de inicio y día de fin para  consultar las horas extras de la semana'
    });
  }
};

let getHorasExtras = (req, res) => {
  if (req.query.date){
    return getHorasExtrasPorDia(req, res);
  }else if (req.query.beginDate && req.query.endDate){
    return getHorasExtrasPorSemana(req, res);
  }else{
    return res.status(400).send({
      message: 'No se enviaron las fechas para ser consultadas'
    });
  }
};

let reporteMensual = (req, res) => {
  if (req.query.month && req.query.year && req.query.location){
    ScheduleLogic
      .reporteMensual(req.query.month, req.query.year, req.query.location)
      .then((persons) => {
        return res.status(200).send(persons);
      })
      .catch((err) => {
        return res.status(400).send({message: err});
      });
  }else{
    return res.status(400).send({
      message: 'No se enviaron todos los parámetros para consultar el reporte mensual'
    });
  }
};

module.exports = {
  saveSchedule,
  getPersonsSchedules,
  getHorasExtrasPorDia,
  getHorasExtrasPorSemana,
  getHorasExtras,
  reporteMensual
};
