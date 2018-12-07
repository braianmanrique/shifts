'use strict';

const CategoryDomain = require('../domain/category');
const ValidadorPermisos = require('../util/validador_de_permisos');
const ErrorCode = require('../util/error-code');

/**
 * Capa lógica de obtener categorías
 * @return {[Promise]}
 */
let getCategories = (Requester) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views,'areas','consultar');
    if (permitido){
      CategoryDomain
        .getCategories()
        .then((categories) => resolve(categories))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};


let getCategoryById = (categoryId) => {
  return new Promise((resolve, reject) => {
    CategoryDomain
      .getCategoryById(categoryId)
      .then((category) => resolve(category))
      .catch((err) => reject(err));
  });
};

let saveCategory = (Requester, category) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views,'areas','crear');
    if (permitido) {
      CategoryDomain
        .saveCategory(category)
        .then((savedCategory) => resolve(savedCategory))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

let editCategory = (Requester, category) => {
  return new Promise((resolve, reject) => {
    let views = Requester.role.views;
    let permitido = ValidadorPermisos.validarPermisos(views,'areas','modificar');
    if (permitido){
      CategoryDomain
        .editCategory(category)
        .then((savedCategory) => resolve(savedCategory))
        .catch((err) => reject(err));
    }else{
      reject(ErrorCode.UNAUTHORIZED.message);
    }
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  saveCategory,
  editCategory
};
