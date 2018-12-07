'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  active: {
    type: Boolean,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  initHour: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
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
  person: {
    type: Schema.ObjectId,
    ref: "Person",
    required: true
  },
  location: {
    type: Schema.ObjectId,
    ref: "Location",
    required: true
  }
});


scheduleSchema.pre('save', function(next) {
  this.creationDate = new Date();
  next();
});

let Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
