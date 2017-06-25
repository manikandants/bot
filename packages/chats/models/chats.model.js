'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ChatSchema = new Schema({
  question: String,
  answer: String,
  tags: [{
    type: String
  }]
});

ChatSchema.index({
  question: 'text'
});

mongoose.model('Chat', ChatSchema);