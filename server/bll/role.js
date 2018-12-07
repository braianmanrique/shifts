'use strict';

const RoleDomain = require('../domain/role');

let getRoles = () => {
  return new Promise((resolve, reject) => {
    RoleDomain
      .getRoles()      
      .then((roles) => resolve(roles))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getRoles
};
