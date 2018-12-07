'use strict';

const PersonLogic = require('../bll/person');
const ErrorCode = require('../util/error-code');
const SuccessCode = require('../util/success-code');

/**
 * [Metodo para invocar el  servicio BLL para crear persona, si la persona tiene id se actualizará y se tomara el atributo active del objeto, si no tiene id se creará y el atributo active tomara el valor de true por defecto]
 * @param  {Request} req [description]
 * @param  {Response} res [description]
 */
let savePerson = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Cuerpo de Petición no ingresado'
    });
  }

  if (req.body._id) {
    PersonLogic
      .editPerson(req.user, req.body)
      .then((personResult) => {
        res.status(200).send({
          message: SuccessCode.SUCCESS_PERSON_EDIT,
          person: personResult
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: 'Error al editar una persona: ' + err
        });
      });
  } else {
    PersonLogic
      .savePerson(req.user, req.body)
      .then((personResult) => {
        res.status(200).send({
          message: SuccessCode.SUCCESS_PERSON_CREATION,
          person: personResult
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: 'Error al guardar una persona: ' + err
        });
      });
  }
};

/**
 * [getPersons Método que invoca el servicio bll para listar personas]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
let getPersons = (req, res) => {
  PersonLogic
    .getPersons(req.user)
    .then((persons) => {
      res.status(200).send(persons);
    })
    .catch((err) => {
      res.status(400).send({
        message: 'Error al obtener personas: ' + err
      });
    });
};

let getPersonsFor = (req, res) => {
  let params = {};
  if (req.query.firstname){
    params.firstname = req.query.firstname;
  }
  if (req.query.lastname){
    params.lastname = req.query.lastname;
  }
  if (req.query.identification){
    params.identification = req.query.identification;
  }
  if (req.query.email){
    params.email = req.query.email;
  }
  if (req.query.username){
    params.username = req.query.username;
  }
  if (req.query.phoneNumber){
    params.phoneNumber = req.query.phoneNumber;
  }
  if (req.query.creationDate){
    //VALIDAR MANEJO DE FECHAS
  }
  if (req.query.modificationDate){
    //VALIDAR MANEJO DE FECHAS
  }
  if (req.query.creationUsername){
    params.creationUsername = req.query.creationUsername;
  }
  if (req.query.modificationUsername){
    params.modificationUsername = req.query.modificationUsername;
  }
  if (req.query.active){
    params.active = req.query.active;
  }
  if (req.query.category){
    params.category = req.query.category;
  }
  if (req.query.location){
    params.location = req.query.location;
  }
  if (req.query.occupation){
    params.occupation = req.query.occupation;
  }
  if (req.query.role){
    params.role = req.query.role;
  }
  if (req.query._id){
    params._id = req.query._id;
  }
  if (Object.keys(params).length > 0){
    PersonLogic
      .getPersonsFor(req.user, params)
      .then((persons) => {
        res.status(200).send(persons);
      })
      .catch((err) => {
        res.status(400).send({
          message: 'Error al obtener personas ' + err
        });
      });
  }else{
    if (req.user.role.name === "SuperAdmin"){
      PersonLogic
        .getPersons(req.user)
        .then((persons) => {
          res.status(200).send(persons);
        })
        .catch((err) => {
          res.status(400).send({
            message: 'Error al obtener personas ' + err
          });
        });
    }else{
      res.status(400).send({
        message: 'No hay parámetros para filtrar personas.'
      });
    }
  }
};



module.exports = {
  getPersons,
  savePerson,
  getPersonsFor
};
