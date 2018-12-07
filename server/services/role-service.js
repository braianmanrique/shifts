'use strict';

const RoleLogic = require('../bll/role');

let getRoles = (req, res) => {
  RoleLogic
    .getRoles()
    .then((roles) => res.status(200).send(roles))
    .catch((err) => res.status(400).send({
      message: err
    }));
};

module.exports = {
  getRoles
};
