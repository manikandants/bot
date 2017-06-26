'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HistorySchema = new Schema({
  question: String,
  response: [{
    question: String,
    answer: String,
    tags: [{
      type: String
    }]
  }],
  user: String,
  timestamp: {
    type: Date,
    default: new Date()
  }
});

HistorySchema.index({
  question: 'text'
});

mongoose.model('History', HistorySchema);