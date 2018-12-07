'use strict';

const SUCCESS = {
  code: '00',
  message: 'Petición exitosa'
};

const SUCCESS_PERSON_CREATION = {
  code: '01',
  message: 'Persona creada exitosamente!'
};

const SUCCESS_PERSON_LIST = {
  code: '02',
  message: 'Personas listada exitosamente!'
};

const SUCCESS_PERSON_EDIT = {
  code: '03',
  message: 'Persona actualizada exitosamente!'
};

const SUCCESS_LOCATION_CREATION = {
  code: '05',
  message: 'Ubicación creada exitosamente!'
};

const SUCCESS_LOCATION_EDIT = {
  code: '06',
  message: 'Ubicación actualizada exitosamente!'
};

const SUCCESS_CATEGORY_CREATION = {
  code: '11',
  message: 'Área creada exitosamente!'
};

const SUCCESS_CATEGORY_EDIT = {
  code: '12',
  message: 'Área actualizada exitosamente!'
};

const SERVER_ERROR = {
  code: '99',
  message: 'Error del servidor'
};

module.exports = {
  SUCCESS,
  SUCCESS_PERSON_CREATION,
  SUCCESS_PERSON_LIST,
  SUCCESS_PERSON_EDIT,
  SUCCESS_LOCATION_CREATION,
  SUCCESS_LOCATION_EDIT,
  SUCCESS_CATEGORY_CREATION,
  SUCCESS_CATEGORY_EDIT,
  SERVER_ERROR
};
