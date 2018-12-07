'use strict';

const Location = require('../models/location');
const LocationLogic = require('../bll/location');
const SuccessCode = require('../util/success-code');

/**
 * [getPersons Método que invoca el servicio bll para listar personas]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
let getLocations = (req, res) => {
  LocationLogic
    .getLocations(req.user)
    .then((locations) => {
      res.status(200).send(locations);
    })
    .catch((err) => {
      res.status(400).send({
        message: err
      });
    });
};

/**
 * [Metodo para invocar el servicio BLL para crear location, si la location tiene id se actualizará y se tomara el atributo isActive del objeto, si no tiene id se creará y el atributo isActive tomara el valor de true por defecto]
 * @param  {Request} req [description]
 * @param  {Response} res [description]
 */
let saveLocation = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Cuerpo de Petición no ingresado'
    });
  }

  let location = new Location(req.body);

  if (req.body._id) {
    LocationLogic
      .editLocation(req.user, location)
      .then((savedLocation) => {
        res.status(200).send({
          message: SuccessCode.SUCCESS_LOCATION_EDIT,
          location: savedLocation
        });
      }).catch((err) => {
        res.status(400).send({
          message: err
        });
      });
  } else {
    LocationLogic
      .saveLocation(req.user, location)
      .then((savedLocation) => {
        res.status(200).send({
          message: SuccessCode.SUCCESS_LOCATION_CREATION,
          location: savedLocation
        });
      }).catch((err) => {
        res.status(400).send({
          message: err
        });
      });
  }
};

module.exports = {
  saveLocation,
  getLocations
};
