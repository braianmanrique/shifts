'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  modificationDate: {
    type: Date
  },
  creationUsername: {
    type: String
  },
  modificationUsername: {
    type: String
  }
});

categorySchema.plugin(uniqueValidator, {
  message: 'Área con el nombre {VALUE} ya existe'
});

categorySchema.pre('save', function(next) {
  this.creationDate = new Date();
  next();
});

let Category = mongoose.model('Category', categorySchema);

module.exports = Category;
