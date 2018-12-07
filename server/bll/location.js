'use strict';

const LocationDomain = require('../domain/location');
const ValidadorPermisos = require('../util/validador_de_permisos');
const ErrorCode = require('../util/error-code');

let getLocations = (Requester) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views,'sitios','consultar');
    if (permitido){
      LocationDomain
        .getLocations()
        .then((locations) => resolve(locations))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let saveLocation = (Requester, location) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'sitios', 'crear');
    if (permitido){
      LocationDomain
        .saveLocation(location)
        .then((savedLocation) => resolve(savedLocation))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let editLocation = (Requester, location) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'sitios', 'modificar');
    if (permitido){
      LocationDomain
        .editLocation(location)
        .then((savedLocation) => resolve(savedLocation))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

module.exports = {
  getLocations,
  editLocation,
  saveLocation
};
