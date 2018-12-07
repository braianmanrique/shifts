'use strict';

const Person = require('../models/person');
const PersonLogic = require('../bll/person');

/**
 * [Metodo que recibe un usuario y mediante las variables de entorno del sistema obtiene usuario y contraseña del sistema, luego se hace la petición a Shalom para autenticar usuario y sistema]
 * @param  {Request} req [description]
 * @param  {Response} res [description]
 */
let login = (req, res) => {
  if (req.body) {
    let person = new Person(req.body);
    PersonLogic
      .login(person)
      .then((keyAuth) => {
        res.status(200).send({
          token: keyAuth,
          user: person
        });
      }).catch((err) => {
        console.log(err);
        res.status(401).send({
          message: err
        });
      });
  } else {
    res.send({
      message: 'Cuerpo de petición no ingresado'
    });
  }
};

module.exports = {
  login
};
