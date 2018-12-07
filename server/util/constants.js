'use strict';

const SALT_ROUND = 10; //Constante Para definir cuantas iteraciones hara bcrypt para encriptar, entre mas alto el número mayor sera el consumo de maquina al encriptar
const SUPER_ADMIN_PROFILE = 'SuperAdmin';
const ADMIN_PROFILE = 'Admin';
const BOSS_PROFILE = 'Jefe';
const EMPLOYEE_PROFILE = 'Empleado';

module.exports = {
  SALT_ROUND,
  SUPER_ADMIN_PROFILE,
  ADMIN_PROFILE,
  BOSS_PROFILE,
  EMPLOYEE_PROFILE
};
