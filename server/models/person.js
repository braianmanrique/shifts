'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  identification: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: {
    type: String
  },
  phoneNumber: {
    type: String
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
  },
  active: {
    type: Boolean
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  occupation: {
    type: String,
    required: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  personColor: {
    type: String,
    trim: true,
    unique: true,
    uniqueCaseInsensitive: true    
  }
});

personSchema.plugin(uniqueValidator, {
  message: 'Persona con el usuario {VALUE} ya existe'
});

personSchema.pre('save', function(next) {
  this.creationDate = new Date();
  next();
});

let Person = mongoose.model('Person', personSchema);

module.exports = Person;
