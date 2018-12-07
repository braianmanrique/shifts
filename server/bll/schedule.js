'use strict';

const ScheduleDomain = require('../domain/schedule');
const ValidadorPermisos = require('../util/validador_de_permisos');
const ErrorCode = require('../util/error-code');
const moment = require('moment');
const festivos = require('colombia-holidays');
const Utils = require('../util/utils');

/*
  TODOS LOS MÉTODOS REALIZAN UNA VALIDACIÓN DE PERSMISOS, CON RESPECTO
  A LA PERSONA QUE SOLICITA EJECUTAR LA OPERACIÓN. ESTA PERSONA (Requester) LLEGA
  CON EL ROL POBLADO, EL CUAL TIENE UN ATRIBUTO DE VISTAS (views), EL CUAL SE UTILIZA PARA REALIZAR LA VALIDACIÓN DE PERMISOS, POR MEDIO DEL COMPONENTE validador_de_permisos
 */


/**
 * El presente método se encarga de guardar un Schedule en la base de datos.
 * @param  {Person}   Requester   Persona que ejecuta la acción.
 * @param  {Schedule} schedule    Schedule que se guardará en la base de datos
 * @return {Schedule}             Schedule guardado en la base de datos
 */

let saveSchedule = (Requester, schedule) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'calendarios', 'crear');
    if (permitido){
      let day = schedule.day<10?'0'+schedule.day:schedule.day;
      let month = schedule.month<10?'0'+schedule.month:schedule.month;
      let year  = schedule.year;
      let dateString = `${year}-${month}-${day}`;
      let today = moment(dateString);
      let yesterday = today.clone();
      yesterday.subtract(1,'d');
      let tomorrow = today.clone();
      tomorrow.add(1,'d');
      let yesterdayColitions = false;
      let todayColitions = false;
      let tomorrowColitions = false;
      let query = {
        person: schedule.person,
        location: schedule.location,
        day: yesterday.date(),
        month: yesterday.month() + 1,
        year: yesterday.year()
      };
      ScheduleDomain
        .getScheduleFor(query)
        .then((schedules) => {
          for (let scheduleAux of schedules){
            if (scheduleAux.initHour + scheduleAux.duration > schedule.initHour + 24){
              yesterdayColitions = true;
              break;
            }
          }
          query.day = today.date();
          query.month = today.month() + 1;
          query.year = today.year();
          ScheduleDomain
            .getScheduleFor(query)
            .then((schedules) => {
              for (let scheduleAux of schedules){
                let begin = schedule.initHour;
                let end = schedule.initHour + schedule.duration;
                let beginAux = scheduleAux.initHour;
                let endAux = scheduleAux.initHour + scheduleAux.duration;
                if(begin >= beginAux && begin <=  endAux || end >= beginAux && end <= endAux){
                  todayColitions = true;
                  break;
                }
              }
              query.day = tomorrow.date();
              query.month = tomorrow.month() + 1;
              query.year = tomorrow.year();
              ScheduleDomain
                .getScheduleFor(query)
                .then((schedules) => {
                  for (let scheduleAux of schedules){
                    if (schedule.initHour + schedule.duration > scheduleAux.initHour + 24){
                      tomorrowColitions = true;
                      break;
                    }
                  }
                  if (!yesterdayColitions && !todayColitions && !tomorrowColitions){
                    ScheduleDomain
                      .saveSchedule(schedule)
                      .then((savedSchedule) => resolve(savedSchedule))
                      .catch((err) => reject(err));
                  }else{
                    reject(ErrorCode.SCHEDULE_COLITION_ERROR);
                  }
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
      }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

/**
 * El presente método edita un Schedule que previamente ha sido guardado en la base de datos.
 * @param  {Person}   Requester Persona que ejecuta la operación.
 * @param  {Schedule} schedule  Schedule que se editará
 * @return {Schedule}           Schedule editado
 */

let editSchedule = (Requester, schedule) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'calendarios', 'modificar');
    if (permitido){
      ScheduleDomain
        .editSchedule(schedule)
        .then((editedSchedule) => resolve(editedSchedule))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let getPersonsSchedules = (Requester, query) => {
  return new Promise((resolve,reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'calendarios', 'consultar');
    if (permitido){
      ScheduleDomain
        .getPersonsSchedules(query)
        .then((persons) => resolve(persons))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

/**
 * El presente método recibe una fecha (sus tres componentes, día, mes y año por separado)
 * y determina si el día es un día festivo (o domingo) de acuerdo al calendario Colombiano
 * @param  {Moment} date   Fecha del día que se validará si es festivo o domingo en
 *                         Colombia
 * @return {boolean}       true si el día dado es festivo (o domingo) en Colombia, false en
 *                         caso contrario
 */

let validarFestivo = (date) => {

  let esFestivo = false;
  if (date.weekday() === 0){
    esFestivo = true;
  }else{
    let day = date.date();
    let month = date.month() + 1;
    let year = date.year();
    if (day < 10){
      day = '0'+day;
    }
    if (month < 10){
      month = '0'+month;
    }
    let dia = `${year}-${month}-${day}`;
    let diasFestivos = festivos.getColombiaHolidaysByYear(year);
    for (let diaFestivo of diasFestivos){
      if (diaFestivo.holiday === dia){
        esFestivo = true;
        break;
      }
    }
  }
  return esFestivo;
};

/**
 * El presente método recibe una hora, y una fecha, para determinar si la hora
 * es una hora de diurna, nocturna, diurna de día festivo o nocturna de día festivo.
 * @param  {int}    hour  hora del día, entero entre 0 y 23
 * @param  {Moment} date  fecha del día
 * @return {int}          código que representa el tipo de hora, entero que
 *                        puede tener uno de los siguientes valores:
 *                        1. Hora normal diurna.
 *                        2. Hora nocturna.
 *                        3. Hora diurna día festivo.
 *                        4. Hora nocturna día festivo.
 */

let validarHora = (hour,date) => {
  let codigo;
  let diurno = false;
  if (hour >= 6 && hour < 21){
    diurno = true;
  }
  if (validarFestivo(date)){
    if (diurno){
      codigo = 3;
    }else{
      codigo = 4;
    }
  }else{
    if (diurno){
      codigo = 1;
    }else{
      codigo = 2;
    }
  }
  return codigo;
};

/**
 * El presente método recibe una lista de Schedules, ordenados cronológicamente por año, mes, día y hora de inicio; y retorna un objeto que contiene la información de las horas correspondiente a ese periodo de tiempo en el que se desarrollan los schedules
 * @param  {[Schedule]} schedules Schedules ordenados cronologicamente por año, mes,
 *                                día y hora de inicio.
 * @return {Object}               Objeto con atributos horasTotales, recargoNocturno,
 *                                recargoFestivoDiurno, recargoFestivoNocturno,
 *                                extraDiurno, extraNocturno, extraFestivoDiurno,
 *                                extraFestivoNocturno
 */

let getEstadoHoras = (schedules) => {
  let horas = 0;
  let recargoNocturno = 0;
  let recargoFestivoDiurno = 0;
  let recargoFestivoNocturno = 0;
  let extraDiurno = 0;
  let extraNocturno = 0;
  let extraFestivoDiurno = 0;
  let extraFestivoNocturno = 0;
  let totalHoras = 0;
  let primerIteracion = true;
  let diaAnterior;
  let auxiliarSchedules = [];
  for (let schedule of schedules){
    if (primerIteracion){
      diaAnterior = schedule.day;
      primerIteracion = false;
    }
    if (diaAnterior != schedule.day){
      horas = 0;
      diaAnterior = schedule.day;
    }
    let inicio = schedule.initHour;
    let final = inicio + schedule.duration;
    let scheduleAuxiliar = {};
    scheduleAuxiliar.day = schedule.day;
    scheduleAuxiliar.month = schedule.month;
    scheduleAuxiliar.year = schedule.year;
    scheduleAuxiliar.person = schedule.person;
    scheduleAuxiliar.location = schedule.location;
    scheduleAuxiliar.initHour = schedule.initHour;
    scheduleAuxiliar.duration = schedule.duration;
    scheduleAuxiliar.initHourAuxiliar = 0;
    let createAuxiliarSchedule = false;
    let auxiliarScheduleDuration = 0;
    for (let i=inicio; i<final; i++){
      if (i >= 24 && !createAuxiliarSchedule){
        createAuxiliarSchedule = true;
      }
      let day = schedule.day;
      let month = schedule.month;
      let year = schedule.year;
      if (day < 10){
        day = '0' + day;
      }
      if (month < 10){
        month = '0' + month;
      }
      let fecha = `${year}-${month}-${day}`;
      let date = moment(fecha);
      let tipoHora = validarHora(i>=24?i-24:i,date);
      if (createAuxiliarSchedule){
        auxiliarScheduleDuration++;
      }
      if (horas === 8 || totalHoras >= 48){
        totalHoras++;
        switch (tipoHora){
          case 1:
            extraDiurno++;
            break;
          case 2:
            extraNocturno++;
            break;
          case 3:
            extraFestivoDiurno++;
            break;
          default:
            extraFestivoNocturno++;
        }
      }else{
        horas++;
        totalHoras++;
        switch (tipoHora){
          case 2:
            recargoNocturno++;
            break;
          case 3:
            recargoFestivoDiurno++;
            break;
          case 4:
            recargoFestivoNocturno++;
            break;
        }
      }
    }
    if (createAuxiliarSchedule){
      scheduleAuxiliar.durationAuxiliar = auxiliarScheduleDuration;
      let dayAuxiliar = scheduleAuxiliar.day;
      if (dayAuxiliar < 10){
        dayAuxiliar = '0' + dayAuxiliar;
      }
      let monthAuxiliar = scheduleAuxiliar.month;
      if (monthAuxiliar < 10){
        monthAuxiliar = '0' + monthAuxiliar;
      }
      let yearAuxiliar = scheduleAuxiliar.year;
      let dateStringAuxiliar = `${yearAuxiliar}-${monthAuxiliar}-${dayAuxiliar}`;
      let dateAuxiliar = moment(dateStringAuxiliar);
      dateAuxiliar.add(1,'d');
      scheduleAuxiliar.dayAuxiliar = dateAuxiliar.date();
      scheduleAuxiliar.monthAuxiliar = dateAuxiliar.month()+1;
      scheduleAuxiliar.yearAuxiliar = dateAuxiliar.year();
      auxiliarSchedules.push(scheduleAuxiliar);
    }
  }
  for (let auxSchedule of auxiliarSchedules){
    schedules.push(auxSchedule);
  }
  let estadoHoras = {};
  estadoHoras.horasNormales = horas;
  estadoHoras.totalHoras = totalHoras;
  estadoHoras.recargoNocturno = recargoNocturno;
  estadoHoras.recargoFestivoDiurno = recargoFestivoDiurno;
  estadoHoras.recargoFestivoNocturno = recargoFestivoNocturno;
  estadoHoras.extraDiurno = extraDiurno;
  estadoHoras.extraNocturno = extraNocturno;
  estadoHoras.extraFestivoDiurno = extraFestivoDiurno;
  estadoHoras.extraFestivoNocturno = extraFestivoNocturno;
  return estadoHoras;
};

/**
 * Este método recibe un beginDate y endDate como parámetros, los cuales se utilizan para buscar las personas activas, con location y category no nulos (que pueden o no venir también como parámetro), y con los Schedules creados a cada persona en el rango de días específicos, que deberína corresponder a una semana. Una vez buscadas, a cada persona se le calcula el estado de horas extras, utilizando métodos auxiliares de este mismo componente.
 * @param  {Person} Requester Persona que ejecuta la acción.
 * @param  {Object} query     Objeto con atributos beginDate (obligatorio), endDate
 *                            (obligatorio), locationId, (opcional) y categoryId
 *                            (opcional).
 * @return {[Person]}         Lista de las personas, cada una con atributo schedules con
 *                            sus horarios, y atributos adicionales que muestran
 *                            información relacionada al estado de horas de esa persona
 *                            en la semana específica.
 */

let getHorasExtrasPorSemana = (Requester, query) => {
  return new Promise((resolve, reject) => {
    let params = {};
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'calendarios', 'consultar');
    if (permitido){
      let momentBeginDate = moment(query.beginDate);
      let momentEndDate = moment(query.endDate);
      params.beginDay = momentBeginDate.date();
      params.beginMonth = momentBeginDate.month() + 1;
      params.beginYear = momentBeginDate.year();
      params.endDay = momentEndDate.date();
      params.endMonth = momentEndDate.month() + 1;
      params.endYear = momentEndDate.year();

      if(query.locationId){
        params.location = query.locationId;
      }

      if(query.categoryId){
        params.category = query.categoryId;
      }
      params.active = true;
      ScheduleDomain
        .getPersonsSchedules(params)
        .then((persons) => {
          for (let persona of persons){
            //let schedules = persona.schedules;
            let schedules = persona._doc.schedules;
            let estadoHoras = getEstadoHoras(schedules);
            persona.set('totalHours',estadoHoras.totalHoras,{strict:false});
            persona.set('surchargeNocturnal',estadoHoras.recargoNocturno,{strict:false});
            persona.set('surchargeHolidayDiurnal',estadoHoras.recargoFestivoDiurno,{strict:false});
            persona.set('surchargeHolidayNocturnal',estadoHoras.recargoFestivoNocturno,{strict:false});
            persona.set('extraDiurnal',estadoHoras.extraDiurno,{strict:false});
            persona.set('extraNocturnal',estadoHoras.extraNocturno,{strict:false});
            persona.set('extraHolidayDiurnal',estadoHoras.extraFestivoDiurno,{strict:false});
            persona.set('extraHolidayNocturnal',estadoHoras.extraFestivoNocturno,{strict:false});
            let horasNormales = estadoHoras.totalHoras - estadoHoras.recargoNocturno - estadoHoras.recargoFestivoDiurno - estadoHoras.recargoFestivoNocturno - estadoHoras.extraDiurno - estadoHoras.extraNocturno - estadoHoras.extraFestivoDiurno - estadoHoras.extraFestivoNocturno;
            persona.set('normalHours',horasNormales,{strict:false});
          }
          resolve(persons);
        })
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

/**
 * El presente método recibe una fecha (como precondición se tiene que NO es un lunes) y retorna parámetros de búsqueda correspondientes al rango de tiempo entre el lunes de esa semana y el día dado menos uno.
 * @param  {Moment} date Fecha dada, como precondición, NO es un lunes
 * @return {Object}      Objeto con fíltros de búsqueda para MongoDB
 */

let getDateParams = (date) => {
  //Como precondición, el día es diferente a 1
  let dateInicio = date.clone();
  let dateFinal = date.clone();
  let params = {};
  if (date.day() === 0){
    dateInicio.subtract(6,'d');
    dateFinal.subtract(1,'d');
  }else{
    dateInicio.subtract(dateInicio.day()-1,'d');
    dateFinal.subtract(1,'d');
  }
  if (dateInicio.day() === dateFinal.day()){
    params.day = dateInicio.date();
    params.month = dateInicio.month() + 1;
    params.year = dateInicio.year();
  }else{

    if (dateInicio.month() <= dateFinal.month()){
      if (dateInicio.date() < dateFinal.date()){
        params.day = {
          $gte: dateInicio.date(),
          $lte: dateFinal.date()
        };
      }else{
        let arrayOr = [];
        let condicion1 = {day:{$gte: dateInicio.date(),$lte:31}};
        let condicion2 = {day:{$gte: 1, $lte:dateFinal.date()}};
        arrayOr.push(condicion1);
        arrayOr.push(condicion2);
        params.$or = arrayOr;
      }
      params.month = {
        $gte: dateInicio.month() + 1,
        $lte: dateFinal.month() + 1
      };
    }else{
      let arrayOr = [];
      let condicion1 = {month:{$gte: dateInicio.month() + 1,$lte:12}};
      let condicion2 = {month:{$gte: 1, $lte:dateFinal.month() + 1}};
      let condicion3 = {day:{$gte: dateInicio.date(),$lte:31}};
      let condicion4 = {day:{$gte: 1, $lte:dateFinal.date()}};
      arrayOr.push(condicion1);
      arrayOr.push(condicion2);
      arrayOr.push(condicion3);
      arrayOr.push(condicion4);
      params.$or = arrayOr;
    }

    params.year = {
      $gte: dateInicio.year(),
      $lte: dateFinal.year()
    };
  }
  return params;
};

/**
 * Método que realiza (por medio del Domain) una consulta de los Schedules, basado en un Query dado
 * @param  {Object} query Parámetros de búsqueda para MongoDB
 * @return {[Schedule]}       Schedules encontrados
 */

let hacerConsulta = (query) => {
  return new Promise((resolve, reject) => {
    ScheduleDomain
      .getScheduleFor(query)
      .then((schedules) => resolve(schedules))
      .catch((err) => reject(err));
  });
};

/**
 * Este método es un método auxiliar que, dada una persona, y una fecha (de tipo moment), se agrega al atributo schedules de las personas, schedules auxiliares con atributos auxiliares para informar sobre schedules del día anterior a la fecha dada que se extienden hasta tocar las primeras horas del día dado. Por ejemplo, un schedule que
 empieza a las 10 de la noche y con una duración de 6 horas.
 Estos horarios llegarán con un arrayHoras lleno de nueves (9), código que indicará a front que deberá pintar en gris.
 * @param  {Person} person Persona de quien se buscarán los schedules del día anterior
 * @param  {Moment} today  día dado
 * @return {void}
 */

let getHorariosAuxiliaresDia = (person, today) => {
  let yesterday = today.clone();
  yesterday.subtract(1,'d');
  let query = {
    day: yesterday.date(),
    month: yesterday.month() + 1,
    year: yesterday.year(),
    location: person.location._id,
    person: person._id
  };
  ScheduleDomain
    .getScheduleFor(query)
      .then((schedulesAux) => {
        if (schedulesAux.length > 0){
          Utils.doAsyncRecursively(schedulesAux, (schedule, doNextSchedule) => {
            if (schedule.initHour + schedule.duration > 24){
              let durationAux = schedule.initHour + schedule.duration - 24;
              schedule.set('dayAuxiliar',today.date(),{strict:false});
              schedule.set('yearAuxiliar',today.date(),{strict:false});
              schedule.set('monthAuxiliar',today.month()+1,{strict:false});
              schedule.set('initHourAuxiliar',0,{strict:false});
              schedule.set('durationAuxiliar',durationAux,{strict:false});
              let arrayHours = [];
              for (let i=0; i<durationAux*2; i+=2){
                arrayHours[i] = 9;
                arrayHours[i+1] = 9;
              }
              schedule.set('arrayHours',arrayHours,{strict:false});
              person._doc.schedules.push(schedule);
            }
            doNextSchedule();
          }, () => {

          });
        }
      });
};

/**
 * Método auxiliar empleado para no tener problemas de asincronísmo en el método de obtener horas extras por día.
 * @param  {Object} persona
 * @param  {Moment} momentDate
 * @param  {number} totalHoras
 * @return {void}
 */

let getEstadoHorasDia = (persona, momentDate, totalHoras) => {
  getHorariosAuxiliaresDia(persona,momentDate);
  let horas = 0;
  let recargoNocturno = 0;
  let recargoFestivoDiurno = 0;
  let recargoFestivoNocturno = 0;
  let extraDiurno = 0;
  let extraNocturno = 0;
  let extraFestivoDiurno = 0;
  let extraFestivoNocturno = 0;
  //let schedules = persona.schedules;
  let schedules = persona._doc.schedules;
  for (let schedule of schedules){
    if (!schedule.yearAuxiliar){
      let horasSchedule = 0;
      let recargoNocturnoSchedule = 0;
      let recargoFestivoDiurnoSchedule = 0;
      let recargoFestivoNocturnoSchedule = 0;
      let extraDiurnoSchedule = 0;
      let extraNocturnoSchedule = 0;
      let extraFestivoDiurnoSchedule = 0;
      let extraFestivoNocturnoSchedule = 0;

      let array = [];
      let j = 0;
      let tipoHoraArreglo;
      let inicio = schedule.initHour;
      let final = inicio + schedule.duration;
      for (let i=inicio; i<final; i++){
        let tipoHora = validarHora(i>=24?i-24:i,momentDate);
        if (horas === 8 || totalHoras >= 48){
          totalHoras++;
          switch (tipoHora){
            case 1:
              extraDiurno++;
              extraDiurnoSchedule++;
              tipoHoraArreglo = 5;
              break;
            case 2:
              extraNocturno++;
              extraNocturnoSchedule++;
              tipoHoraArreglo = 6;
              break;
            case 3:
              extraFestivoDiurno++;
              extraFestivoDiurnoSchedule++;
              tipoHoraArreglo = 7;
              break;
            default:
              extraFestivoNocturno++;
              extraFestivoNocturnoSchedule++;
              tipoHoraArreglo = 8;
          }
        }else{
          horas++;
          totalHoras++;
          switch (tipoHora){
            case 2:
              recargoNocturno++;
              recargoNocturnoSchedule++;
              tipoHoraArreglo = 2;
              break;
            case 3:
              recargoFestivoDiurno++;
              recargoFestivoDiurnoSchedule++;
              tipoHoraArreglo = 3;
              break;
            case 4:
              recargoFestivoNocturno++;
              recargoFestivoNocturnoSchedule++;
              tipoHoraArreglo = 4;
              break;
            default:
              tipoHoraArreglo = 1;
              horasSchedule++;
          }
        }
        array[j] = tipoHoraArreglo;
        array[j+1] = tipoHoraArreglo;
        j += 2;
      }
      schedule.set('arrayHours',array,{strict:false});
      schedule.set('normalHours',horasSchedule,{strict:false});
      schedule.set('surchargeNocturnal',recargoNocturnoSchedule,{strict:false});
      schedule.set('surchargeHolidayDiurnal',recargoFestivoDiurnoSchedule,{strict:false});
      schedule.set('surchargeHolidayNocturnal',recargoFestivoNocturnoSchedule,{strict:false});
      schedule.set('extraDiurnal',extraDiurnoSchedule,{strict:false});
      schedule.set('extraNocturnal',extraNocturnoSchedule,{strict:false});
      schedule.set('extraHolidayDiurnal',extraFestivoDiurnoSchedule,{strict:false});
      schedule.set('extraHolidayNocturnal',extraFestivoNocturnoSchedule,{strict:false});
    }
  }
  let horasTotalesDia = horas + extraDiurno + extraNocturno + extraFestivoDiurno + extraFestivoNocturno;
  //persona.set('totalHours',totalHoras,{strict:false});
  persona.set('totalHours',horasTotalesDia,{strict:false});
  persona.set('surchargeNocturnal',recargoNocturno,{strict:false});
  persona.set('surchargeHolidayDiurnal',recargoFestivoDiurno,{strict:false});
  persona.set('surchargeHolidayNocturnal',recargoFestivoNocturno,{strict:false});
  persona.set('extraDiurnal',extraDiurno,{strict:false});
  persona.set('extraNocturnal',extraNocturno,{strict:false});
  persona.set('extraHolidayDiurnal',extraFestivoDiurno,{strict:false});
  persona.set('extraHolidayNocturnal',extraFestivoNocturno,{strict:false});
  // let horasNormales = horas - extraDiurno - extraNocturno - extraFestivoDiurno - extraFestivoNocturno;
  persona.set('normalHours',horas,{strict:false});
};

/**
 * Este método recibe un Date como parámetro, el cual se utiliza para buscar las personas activas, con location y category no nulos (que pueden o no venir también como parámetro), y con los Schedules creados a cada persona en el día específico. Una vez buscadas, a cada persona se le calcula el estado de horas extras, utilizando métodos auxiliares de este mismo componente.
 * @param  {Person} Requester Persona que ejecuta la acción.
 * @param  {Object} query     Objeto con atributos Date (obligatorio), locationId
 *                            (opcional) y categoryId (opcional).
 * @return {[Person]}         Lista de las personas, cada una con atributo schedules con
 *                            sus horarios, y atributos adicionales que muestran
 *                            información relacionada al estado de horas de esa persona
 *                            en el día específico.
 */

let getHorasExtrasPorDia = (Requester, query) => {
  return new Promise((resolve, reject) => {
    let params = {};
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'calendarios', 'consultar');
    if (permitido){
      let momentDate = moment(query.date);
      params.day = momentDate.date();
      params.month = momentDate.month() + 1;
      params.year = momentDate.year();

      if(query.locationId){
        params.location = query.locationId;
      }

      if(query.categoryId){
        params.category = query.categoryId;
      }
      params.active = true;
      ScheduleDomain
        .getPersonsSchedules(params)
        .then((persons) => {
          Utils.doAsyncRecursively(persons,(persona, doNextPerson) => {
            let totalHoras = 0;
            if (momentDate.day() != 1){
              let params = {};
              params.person = persona._id;
              params.location = persona.location._id;
              let dateParams = getDateParams(momentDate);
              if (dateParams.day){
                params.day = dateParams.day;
              }
              if (dateParams.month){
                params.month = dateParams.month;
              }
              if (dateParams.year){
                params.year = dateParams.year;
              }
              if (dateParams.$or){
                params.$or = dateParams.$or;
              }
              let aux;
              //getHorariosAuxiliaresDia(persona,momentDate);
              hacerConsulta(params)
                .then((schedules) => {
                  aux = schedules;
                  let horasAux = getEstadoHoras(aux);
                  totalHoras += horasAux.totalHoras;
                  getEstadoHorasDia(persona,momentDate,totalHoras);
                  doNextPerson();
                });
            } else {
              //getHorariosAuxiliaresDia(persona,momentDate);
              getEstadoHorasDia(persona,momentDate,totalHoras);
              doNextPerson();
            }
          },() => {//Callback final para cuando se termina de iterar el arreglo
            resolve(persons);
          }
        );
        })
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let lastDayOfWeek = (givenDate) => {
  return new Promise((resolve, reject) => {
    try {
      let answer = givenDate.clone();
      answer.endOf('isoWeek');
      if (givenDate.month() != answer.month()){
        answer.subtract(answer.date(),'d');
      }
      resolve(answer);
    } catch (err){
      reject(err);
    }
  });
};

let reporteMensualAux = (month, year, location) => {
  console.log("ENTRA A BLL reporteMensual");
  return new Promise((resolve,reject) => {
    console.log("ENTRA A reporteMensual, parametros:");
    console.log(`Month:${month}, year:${year}, location: ${location}`);
    if (month < 10){
      month = '0' + month;
    }
    console.log(`STRING PARA CREACION DE MOMENT: ${year}-${month}-01`);
    let firstDate = moment(`${year}-${month}-01`);
    let lastDate = firstDate.clone().add(1,'M').subtract(1,'d');
    let query = {};
    query.location = location;
    query.beginDay = firstDate.date();
    query.beginMonth = firstDate.month() + 1;
    query.beginYear = firstDate.year();
    query.endDay = lastDate.date();
    query.endMonth = lastDate.month() + 1;
    query.endYear = lastDate.year();
    query.active = true;
    console.log("QUERY PARA GETPERSONSSCHEDULES");
    console.log(query);
    ScheduleDomain
      .getPersonsSchedules(query)
      .then((persons) => {
        Utils.doAsyncRecursively(persons, (person, doNextPerson) => {
          let schedulesAuxiliar = [];
          let schedules = person._doc.schedules;
          if (person.lastname == "Arias"){
            console.log("SCHEDULES");
            console.log(schedules);
          }
          let begin = firstDate.clone();
          let horasNormales = 0;
          let totalHoras = 0;
          let recargoNocturno = 0;
          let recargoFestivoDiurno = 0;
          let recargoFestivoNocturno = 0;
          let extraDiurno = 0;
          let extraNocturno = 0;
          let extraFestivoDiurno = 0;
          let extraFestivoNocturno = 0;
          Utils.doAsyncRecursively(schedules , (schedule, doNextSchedule) => {
            lastDayOfWeek(begin)
              .then((last) => {
                let daySchedule = schedule.day<10?'0'+schedule.day:schedule.day;
                let monthSchedule = schedule.month<10?'0'+schedule.month:schedule.month;
                let yearSchedule = schedule.year;
                let dateSchedule = moment(`${yearSchedule}-${monthSchedule}-${daySchedule}`);
                if (dateSchedule <= last){
                  schedulesAuxiliar.push(schedule);
                  doNextSchedule();
                }else{
                  //Procesar schedules (getEstadoHoras), sumar los valores, limpiar lista auxiliar, cambiar begin por
                  //last + 1, agregar schedule a la lista, siguiente iteracion
                  if (person.lastname=="Arias"){
                    console.log(person.firstname + " " + person.lastname);
                    console.log("SCHEDULES AUXILIAR");
                    console.log(schedulesAuxiliar);
                  }
                  let horas = getEstadoHoras(schedulesAuxiliar);
                  if (person.lastname=="Arias"){
                    console.log(begin);
                    console.log(last);
                    console.log("RESULTADO GET ESTADO HORAS: ");
                    console.log(horas);
                  }
                  let horasNormalesAux = horas.totalHoras - horas.recargoNocturno - horas.recargoFestivoDiurno - horas.recargoFestivoNocturno - horas.extraDiurno - horas.extraNocturno - horas.extraFestivoDiurno - horas.extraFestivoNocturno;
                  horasNormales += horasNormalesAux;
                  totalHoras += horas.totalHoras;
                  recargoNocturno += horas.recargoNocturno;
                  recargoFestivoDiurno += horas.recargoFestivoDiurno;
                  recargoFestivoNocturno += horas.recargoFestivoNocturno;
                  extraDiurno += horas.extraDiurno;
                  extraNocturno += horas.extraNocturno;
                  extraFestivoDiurno += horas.extraFestivoDiurno;
                  extraFestivoNocturno += horas.extraFestivoNocturno;
                  schedulesAuxiliar = [];
                  begin = last.clone();
                  begin.add(1,'d');
                  schedulesAuxiliar.push(schedule);
                  doNextSchedule();
                }
              });
          }, () => {
            if (schedulesAuxiliar.length > 0){
              let horas = getEstadoHoras(schedulesAuxiliar);
              let horasNormalesAux = horas.totalHoras - horas.recargoNocturno - horas.recargoFestivoDiurno - horas.recargoFestivoNocturno - horas.extraDiurno - horas.extraNocturno - horas.extraFestivoDiurno - horas.extraFestivoNocturno;
              horasNormales += horasNormalesAux;
              totalHoras += horas.totalHoras;
              recargoNocturno += horas.recargoNocturno;
              recargoFestivoDiurno += horas.recargoFestivoDiurno;
              recargoFestivoNocturno += horas.recargoFestivoNocturno;
              extraDiurno += horas.extraDiurno;
              extraNocturno += horas.extraNocturno;
              extraFestivoDiurno += horas.extraFestivoDiurno;
              extraFestivoNocturno += horas.extraFestivoNocturno;
            }
            person.set('horasNormales',horasNormales,{strict:false});
            person.set('totalHoras',totalHoras,{strict:false});
            person.set('recargoNocturno',recargoNocturno,{strict:false});
            person.set('recargoFestivoDiurno',recargoFestivoDiurno,{strict:false});
            person.set('recargoFestivoNocturno',recargoFestivoNocturno,{strict:false});
            person.set('extraDiurno',extraDiurno,{strict:false});
            person.set('extraNocturno',extraNocturno,{strict:false});
            person.set('extraFestivoDiurno',extraFestivoDiurno,{strict:false});
            person.set('extraFestivoNocturno',extraFestivoNocturno,{strict:false});
            doNextPerson();
          });
        }, () => {
          resolve(persons);
        });
      })
      .catch((err) => reject(err));
  });
};

let reporteMensual = (month, year, location) => {
  return new Promise((resolve, reject) => {
    reporteMensualAux(month, year, location)
      .then((persons) => {
        let reporte = [];
        Utils.doAsyncRecursively(persons, (person, doNextPerson) => {
          
        }, () => {

        });
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  saveSchedule,
  editSchedule,
  getPersonsSchedules,
  getHorasExtrasPorDia,
  getHorasExtrasPorSemana,
  reporteMensual
};
