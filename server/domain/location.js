'use strict';

const Location = require('../models/location');

/**
 * [getLocations Método que consulta location por el id de location]
 * @return {[type]} [description]
 */

let getLocations = () => {
  return new Promise((resolve, reject) => {
    Location
      .find()
      .then((locations) => resolve(locations))
      .catch((err) => reject(err));
  });
};

/**
 * [saveLocation Método que salva Locations ]
 * @return {[type]} [description]
 */
let saveLocation = (location) => {
  return new Promise((resolve, reject) => {
    location
      .save()
      .then((savedLocation) => resolve(savedLocation))
      .catch((err) => reject(err));
  });
};

/**
 * [editLocation Método que consulta sitio por el id de location]
 * @return {[type]} [description]
 */
let editLocation = (location) => {
  const whereArgs = {
    _id: location._id
  };
  const updateParams = {
    $set: {
      name: location.name,
      modificationDate: new Date(),
      modificationUsername: location.modificationUsername,
    }
  };
  const updateConfig = {
    runValidators: true,
    context: 'query',
    new: true
  };

  return new Promise((resolve, reject) => {
    Location
      .findOneAndUpdate(whereArgs, updateParams, updateConfig)
      .then((location) => resolve(location))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getLocations,
  saveLocation,
  editLocation
};
