'use strict';

const bcrypt = require('bcrypt');
const PersonDomain = require('../domain/person');
const Constants = require('../util/constants');
const ErrorCode = require('../util/error-code');
const jwt = require('../util/jwt');
const ValidadorPermisos = require('../util/validador_de_permisos');
const HexaGenerator = require('../util/hexa_generator');

let getPersons = (Requester) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'personas', 'consultar');
    if (permitido){
      PersonDomain
        .getPersons()
        .then((persons) => resolve(persons))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let savePerson = (Requester, person) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'personas', 'crear');
    if (permitido){
      bcrypt.hash(person.password, Constants.SALT_ROUND, (err, hashPass) => {
        if (err) {
          reject(err);
        }
        person.password = hashPass;
        HexaGenerator.getUniqueHexa()
          .then((newColor) => {
            person.personColor = newColor;
            console.log("NEW COLOR: " + newColor);
            console.log("Persona: " + person);
            console.log("Color Persona: " + person.personColor);
            PersonDomain
              .savePerson(person)
              .then((savedPerson) => {
                savedPerson.password = null;
                resolve(savedPerson);
              })
              .catch((err) => reject(err));
          });
      });
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let editPerson = (Requester, person) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'personas', 'modificar');
    if (permitido){
      PersonDomain
        .editPerson(person)
        .then((personEdited) => {
          resolve(personEdited);
        })
        .catch((err) => {
          reject(err);
        });
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

/**
 * [findApiKey description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
let login = (person) => {
  return new Promise((resolve, reject) => {
    PersonDomain
      .findPersonByUsername(person)
      .then((foundPerson) => {
        if (foundPerson){
          if (foundPerson.active){
            if (foundPerson.role.name != "Empleado"){
              bcrypt.compare(person.password, foundPerson.password).then((res) => {
                if (res) {
                  Object.assign(person, foundPerson);
                  person.password = null;
                  resolve(jwt.createToken(person));
                }else{
                  reject(ErrorCode.INCORRECT_PASSWORD_ERROR);
                }
              }).catch((err) => reject(err));
            }else{
              reject(ErrorCode.UNAUTHORIZED);
            }
          }else{
            reject(ErrorCode.UNAUTHORIZED);
          }
        }else{
          reject(ErrorCode.USERNAME_NOT_EXISTS);
        }
      }).catch((err) => reject(err));
  });
};

let getPersonsFor = (Requester, whereParams) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views, 'personas', 'consultar');
    if (permitido){
      PersonDomain
        .getPersonsFor(whereParams)
        .then((persons) => resolve(persons))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

module.exports = {
  getPersons,
  savePerson,
  editPerson,
  login,
  getPersonsFor
};
