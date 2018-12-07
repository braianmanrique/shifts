'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  views: [
    {
      name : {
                type: String, required: true
              },
      operations : {
                  type: [String], required: true

    }            }
  ]
});

let Role = mongoose.model('Role', roleSchema);

module.exports = Role;
