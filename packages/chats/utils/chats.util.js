'use strict';

const mongoose = require('mongoose');
const History = mongoose.model('History');

exports.addHistory = (history, cb) => {
  History.create(history, (err) => {
    if (err) {
      return cb(501);
    }
    return cb(null);
  });
};