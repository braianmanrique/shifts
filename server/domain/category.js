'use strict';

const Category = require('../models/category');

/**
 * [getCategories Método que consulta category por el id de category]
 * @return {[type]} [description]
 */
let getCategories = () => {
  return new Promise((resolve, reject) => {
    Category
      .find()
      .then((categories) => resolve(categories))
      .catch((err) => reject(err));
  });
};

/**
 * [saveCategory Método que guarda categorías ]
 * @return {[type]} [description]
 */

let saveCategory = (category) => {
  return new Promise((resolve, reject) => {
    category
      .save()
      .then((savedCategory) => resolve(savedCategory))
      .catch((err) => reject(err));
  });
};

/**
 * Metodo que actualiza una categoría por id
 * @return {[type]} [description]
 */

let editCategory = (category) => {
  const whereArgs = {
   _id: category._id
 };
 const updateParams = {
   $set: {
     name: category.name,
     modificationDate: new Date(),
     modificationUsername: category.modificationUsername
   }
 };
 const updateConfig = {
   runValidators: true,
   context: 'query',
   new: true
 };

 return new Promise((resolve, reject) => {
   Category.findOneAndUpdate(whereArgs, updateParams, updateConfig)
     .then((category) => resolve(category))
     .catch((err) => reject(err));
 });
};

module.exports = {
  getCategories,
  saveCategory,
  editCategory
};
