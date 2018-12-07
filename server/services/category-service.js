'use strict';

const Category = require('../models/category');
const CategoryLogic = require('../bll/category');
const SuccessCode = require('../util/success-code');
const ErrorCode = require('../util/error-code');
/**
 * [getCategories Método que invoca el servicio bll para listar categories]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
let getCategories = (req, res) => {
  CategoryLogic
  .getCategories(req.user)
  .then((categories) => {
    res.status(200).send(categories);
  }).catch((err) => {
    let status;
    let error = ErrorCode.UNAUTHORIZED;
    if (err === error.message){
      status = 401;
    }else{
      status = 400;
    }
    res.status(status).send({
      message: err
    });
  });

};


/**
 * [Metodo para invocar el servicio BLL para crear categories, si la categories tiene id se actualizará y se tomara el atributo active del objeto, si no tiene id se creará y el atributo active tomara el valor de true por defecto]
 * @param  {Request} req [description]
 * @param  {Response} res [description]
 */
let saveCategory = (req, res) => {
  let category = new Category();
  if (req.body) {
      category.name = (req.body.name ? req.body.name : null);
      category._id = (req.body._id ? req.body._id : null);
      category.creationUsername = (req.body.creationUsername ? req.body.creationUsername : null);
      category.modificationUsername = (req.body.modificationUsername ? req.body.modificationUsername : null);
      if(req.body._id){
        CategoryLogic
          .editCategory(req.user, category)
          .then((categoryResult) => {
              res.status(200).send({
                message: SuccessCode.SUCCESS_CATEGORY_EDIT,
                category: categoryResult
            });
          }).catch((err) => {
            res.status(400).send({
              message: err
            });
          });
      }else{
      CategoryLogic
        .saveCategory(req.user, category)
        .then((categoryResult) => {
            res.status(200).send({
              message: SuccessCode.SUCCESS_CATEGORY_CREATION,
              category: categoryResult
          });
        }).catch((err) => {
          res.status(400).send({
            message: err
          });
        });
      }
  } else {
    return res.status(400).send({
      message: 'Cuerpo de Petición no ingresado'
    });
  }
};

module.exports = {
  saveCategory,
  getCategories
};
