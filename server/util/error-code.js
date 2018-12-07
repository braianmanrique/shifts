'use strict';

const SUCCESS = {
  code: '00',
  message: 'Petición exitosa'
};

const INVALID_APIKEY_ERROR = {
  code: '01',
  message: 'Api Key Invalida'
};

const HEADER_NO_EXISTS_ERROR = {
  code: '02',
  message: 'No existe header de autorización'
};

const PERSON_EXISTS_ERROR = {
  code: '03',
  message: 'Persona ya existe'
};

const CATEGORY_EXISTS_ERROR = {
  code: '04',
  message: 'Categoria ya existe'
};

const PROJECT_EXISTS_ERROR = {
  code: '05',
  message: 'Proyecto ya existe'
};

const THIRDPARTY_EXISTS_ERROR = {
  code: '06',
  message: 'Tercero ya existe'
};

const ITEM_EXISTS_ERROR = {
  code: '07',
  message: 'Item ya existe'
};

const AUTH_NO_EXISTS_ERROR = {
  code: '08',
  message: 'Usuario no válido'
};

const INCORRECT_PASSWORD_ERROR = {
  code: '09',
  message: 'Contraseña incorrecta'
};

const UNAUTHORIZED = {
  code: '10',
  message: 'El solicitante no tiene permisos para ejecutar la operación'
};

const USERNAME_NOT_EXISTS = {
  code: '11',
  message: 'El nombre de usuario no existe'
};

const SERVER_ERROR = {
  code: '99',
  message: 'Error del servidor'
};

const PARAMETER_DEFINITION_ERROR = {
  code: '98',
  message: 'Parámetro De Autenticacion no Definido'
};

const SESSION_EXPIRED_ERROR = {
  code: '97',
  message: 'Sesión Expirada'
};

const INVALID_TOKEN_ERROR = {
  code: '96',
  message: 'Token No Válido'
};

const SCHEDULE_COLITION_ERROR = {
  code: '97',
  message: 'El turno coincide con otro turno existente, creando una colisión'
};


module.exports = {
  UNAUTHORIZED,
  SUCCESS,
  INVALID_APIKEY_ERROR,
  HEADER_NO_EXISTS_ERROR,
  PERSON_EXISTS_ERROR,
  CATEGORY_EXISTS_ERROR,
  PROJECT_EXISTS_ERROR,
  THIRDPARTY_EXISTS_ERROR,
  ITEM_EXISTS_ERROR,
  SERVER_ERROR,
  AUTH_NO_EXISTS_ERROR,
  PARAMETER_DEFINITION_ERROR,
  INVALID_TOKEN_ERROR,
  SESSION_EXPIRED_ERROR,
  INCORRECT_PASSWORD_ERROR,
  USERNAME_NOT_EXISTS,
  SCHEDULE_COLITION_ERROR
};
