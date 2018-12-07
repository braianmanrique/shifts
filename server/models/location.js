'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  creationDate: {
    type: Date
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

locationSchema.plugin(uniqueValidator, {
  message: 'Ubicación con el nombre {VALUE} ya existe'
});

locationSchema.pre('save', function(next) {
  this.creationDate = new Date();
  next();
});

let Location = mongoose.model('Location', locationSchema);

module.exports = Location;
