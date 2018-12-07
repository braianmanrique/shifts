'use strict';

const CategoryService = require('../services/category-service');
const express = require('express');
const Authenticated = require('../middlewares/authenticated');

let api = express.Router();

/* GET api listing. */
api.route('/category')
  .post(Authenticated.ensureAuth, CategoryService.saveCategory)
  .get(Authenticated.ensureAuth, CategoryService.getCategories);

module.exports = api;
