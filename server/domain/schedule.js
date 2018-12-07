'use strict';

const Schedule = require('../models/schedule');
const Person = require('../models/person');
const moment = require('moment');
const Utils = require('../util/utils');

/**
 * Método que busca los Schedules correspondientes a una location en particular
 * @param  {Schema.ObjectId} locationId ID del location específico
 * @return {Promise}
 */
let getScheduleByLocation = (locationId) => {
  const whereArgs = {

  };
  if (locationId) {
    whereArgs.location = locationId;
  }
  const populateArgs = [{
      path: 'location',
      ref: 'Location'
    },
    {
      path: 'person',
      ref: 'Person'
    }
  ];
  return new Promise((resolve, reject) => {
    Schedule
      .find(whereArgs)
      .populate(populateArgs)
      .then((schedules) => resolve(schedules))
      .catch((err) => reject(err));
  });
};

/**
 * Método que guarda un nuevo schedule
 * @param  {Schedule} schedule
 * @return {Promise}          [description]
 */
let saveSchedule = (schedule) => {
  return new Promise((resolve, reject) => {
    schedule
      .save()
      .then((savedSchedule) => resolve(savedSchedule))
      .catch((err) => reject(err));
  });
};

/**
 * Método que edita un schedule, teniendo en cuenta que la persona asociada a un
 * schedule no puede editarse, ni la locación
 * @param  {Schedule} schedule
 * @return {Promise}
 */
let editSchedule = (schedule) => {
  const whereArgs = {
    _id: schedule._id
  };
  const updateParams = {
    $set: {
      active: schedule.active,
      month: schedule.month,
      day: schedule.day,
      year: schedule.year,
      initHour: schedule.initHour,
      duration: schedule.duration,
      personId: schedule.personId,
      locationId: schedule.locationId,
      modificationDate: new Date()
    }
  };
  const updateConfig = {
    runValidators: true,
    context: 'query',
    new: true
  };
  return new Promise((resolve, reject) => {
    Schedule.findOneAndUpdate(whereArgs, updateParams, updateConfig)
      .then((schedule) => resolve(schedule))
      .catch((err) => reject(err));
  });
};

/**
 * Método que realiza la consulta de personas con sus respectivos schedules, dependiendo de lo que provenga del objeto query se haces los filtros
 * en la consulta, hay una validación donde se pregunta si viene una unica fecha o un rango de fechas para traers los schedules por persona, los schedules se organizan de
 * forma ascendente por los atributos year, month, day e initHour
 * @param  {object} query
 * @return {Promise}
 */
let getPersonsSchedules = (query) => {
  let personQuery = {};
  let scheduleQuery = {};
  const sortArgs = {
    year: 1,
    month: 1,
    day: 1,
    initHour: 1
  };

  personQuery.category = (query.category ? query.category : {$ne: null});
  personQuery.location = (query.location ? query.location : {$ne: null});
  if (query.active) {
    let or = [];
    or.push({active:true});
    or.push({active:false});
    personQuery.$or = or;
  }else{
    personQuery.active = true;
  }
  if(query.day && query.month && query.year){
    scheduleQuery.day = query.day;
    scheduleQuery.month = query.month;
    scheduleQuery.year = query.year;
  }else if(query.beginDay && query.beginMonth && query.beginYear && query.endDay && query.endMonth && query.endYear){

    if (query.beginMonth <= query.endMonth){
      if (query.beginDay < query.endDay){
        scheduleQuery.day = {
          $gte: query.beginDay,
          $lte: query.endDay
        };
      }else{
        let arrayOr = [];
        let condicion1 = {day:{$gte: query.beginDay,$lte:31},month:query.beginMonth};
        let condicion2 = {day:{$gte: 1, $lte:query.endDay},month:query.endMonth};
        arrayOr.push(condicion1);
        arrayOr.push(condicion2);
        scheduleQuery.$or = arrayOr;
      }
      scheduleQuery.month = {
        $gte: query.beginMonth,
        $lte: query.endMonth
      };
    }else{
      let arrayOr = [];
      let condicion1 = {month:{$gte: query.beginMonth,$lte:12},day:{$gte: query.beginDay,$lte:31}};
      let condicion2 = {month:{$gte: 1, $lte:query.endMonth},day:{$gte: 1, $lte:query.endDay}};
      arrayOr.push(condicion1);
      arrayOr.push(condicion2);
      scheduleQuery.$or = arrayOr;
    }


    scheduleQuery.year = {
      $gte: query.beginYear,
      $lte: query.endYear
    };
  }

  //console.log("personQuery ", personQuery);
  return new Promise((resolve,reject) => {
    Person
    .find(personQuery)
    .sort({identification:1})
    .populate('location')
    .populate('category')
    .then((persons) => {
      //console.log("length ", persons.length);
      console.log("PERSONAS ENCONTRADAS: ");
      console.log(persons.length);
      Utils.doAsyncRecursively(persons,
        (person,doNext) => {
          scheduleQuery.person = person._id;
          //console.log("scheduleQuery ", scheduleQuery);
          Schedule
            .find(scheduleQuery)
            .sort(sortArgs)
            .then((personSchedule) => {
              //Se setea y se convierte en objeto plano javascript, el strict false es para que permita un atributo que no pertenece al modelo de mongoose
              person.set('schedules',personSchedule,{strict:false});
              person.toObject();
              doNext();
            });
        },
        () => {
          resolve(persons);
        });
    })
    .catch((err) => reject(err));
  });
};

let getScheduleFor = (whereParams) => {
  if (Object.keys(whereParams).length > 0){
    return new Promise((resolve, reject) => {
      const sortArgs = {
        year: 1,
        month: 1,
        day: 1,
        initHour: 1
      };
      Schedule
        .find(whereParams)
        .sort(sortArgs)
        .then((schedules) => resolve(schedules))
        .catch((err) => reject(err));
    });
  }
};

module.exports = {
  getScheduleByLocation,
  saveSchedule,
  editSchedule,
  getPersonsSchedules,
  getScheduleFor
};
