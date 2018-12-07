'use strict';

const jwt = require('jwt-simple');
var moment = require('moment');

let createToken = (user) => {
  const payload = {
    user,
    iat: moment().utc().unix(), //Fecha de creacion del token
    exp: moment().utc().add(5, 'hours').unix() //Fecha de expiracion del token
  };
  console.log(moment().format());
  return jwt.encode(payload, process.env.SHIFTS_SEC_KEY);
};


module.exports = {
  createToken
};
