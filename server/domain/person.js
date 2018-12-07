'use strict';

const Person = require('../models/person');

/**
 * Método que realiza la consulta en base de datos de person por id
 * @param  {String} personId [description]
 * @return {Promise}           [description]
 */
let getPersonById = (personId) => {
  const whereArgs = {
    _id: personId
  };
  return new Promise((resolve, reject) => {
    Person
      .findOne(whereArgs)
      .then((person) => resolve(person))
      .catch((err) => reject(err));
  });
};

/**
 * [getPersons Método que consulta personas por el id de la compañia, no se traen las contraseñas y se hace el populate de location,]
 * @return {[type]} [description]
 */
let getPersons = () => {
  const selectArgs = {
    password: 0
  };
  const populateArgs = [{
      path: 'location',
      ref: 'Location'
    },
    {
      path: 'category',
      ref: 'Category'
    },
    {
      path: 'role',
      ref: 'Role'
    }
  ];
  return new Promise((resolve, reject) => {
    Person
      .find()
      .select(selectArgs)
      .populate(populateArgs)
      .then((persons) => {
        console.log("persons ", persons);
        resolve(persons);
      })
      .catch((err) => reject(err));
  });
};



/**
 * [savePerson Método que consulta personas por el id de person]
 * @return {[type]} [description]
 */

let savePerson = (person) => {
  let personDb = new Person();
  personDb.firstname = person.firstname;
  personDb.lastname = person.lastname;
  personDb.identification = person.identification;
  personDb.email = person.email;
  personDb.username = person.username;
  personDb.password = person.password;
  personDb.phoneNumber = person.phoneNumber;
  personDb.active = person.active;
  personDb.occupation = person.occupation;
  personDb.category = (person.category ? person.category._id : null);
  personDb.location = (person.location ? person.location._id : null);
  personDb.role = (person.role ? person.role._id : null);
  personDb.personColor = person.personColor;
  return new Promise((resolve, reject) => {
    personDb
      .save()
      .then((savedPerson) => resolve(savedPerson))
      .catch((err) => reject(err));
  });
};

/**
 * [editPerson Método que consulta personas por el id de person]
 * @return {[type]} [description]
 */

let editPerson = (person) => {
  const whereArgs = {
    _id: person._id
  };
  const updateParams = {
    $set: {
      firstname: person.firstname,
      lastname: person.lastname,
      identification: person.identification,
      email: person.email,
      modificationUsername: person.modificationUsername,
      phoneNumber: person.phoneNumber,
      modificationDate: new Date(),
      active: person.active,
      category: (person.category ? person.category._id : null),
      location: (person.location ? person.location._id : null),
      occupation: (person.occupation ? person.occupation : null),
      role: (person.role ? person.role._id : null)
    }
  };
  const updateConfig = {
    runValidators: true,
    context: 'query',
    new: true
  };

  return new Promise((resolve, reject) => {
    Person
      .findOneAndUpdate(whereArgs, updateParams, updateConfig)
      .then((person) => resolve(person))
      .catch((err) => reject(err));
  });
};

let findPersonByUsername = (person) => {
  const whereArgs = {
    username: person.username
  };
  const populateArgs = [{
      path: 'location',
      ref: 'Location'
    },
    {
      path: 'category',
      ref: 'Category'
    },
    {
      path: 'role',
      ref: 'Role'
    }
  ];
  return new Promise((resolve, reject) => {
    Person
      .findOne(whereArgs)
      .populate(populateArgs)
      .then((person) => resolve(person))
      .catch((err) => reject(err));
  });
};

let getPersonsFor = (whereParams) => {
  console.log(whereParams);
  let populateArgs = [
    {path: 'category', ref: 'Category'},
    {path: 'location', ref: 'Location'},
    {path: 'role', ref: 'Role'}
  ];
  if (Object.keys(whereParams).length > 0){
    return new Promise((resolve, reject) => {
      Person
        .find(whereParams)
        .populate(populateArgs)
        .then((persons) => resolve(persons))
        .catch((err) => reject(err));
    });
  }else{
    //VALIDAR EL RETORNO DE ERROR.
    console.log('ERROR, NO HAY PARAMETROS');
  }
};

module.exports = {
  getPersons,
  getPersonById,
  savePerson,
  editPerson,
  findPersonByUsername,
  getPersonsFor
};
