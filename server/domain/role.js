'use strict';

const Role = require('../models/role');

let getRoles = () => {
  return new Promise((resolve, reject) => {
    Role
      .find()
      .then((roles) => resolve(roles))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getRoles
};
