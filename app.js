'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = 'mongodb://localhost/bottr';
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', express.static(path.join(__dirname, 'www')));

require('./packages/chats/models/chats.model');
require('./packages/chats/models/history.model');
require('./packages/chats/routes/chats.route')(app);

mongoose.connect(db, (err) => {
  if (err) {
    console.log(err.message);
    console.log(err);
  } else {
    console.log('Connected to MongoDb');
  }
});

mongoose.set('debug', true);

app.listen(3000);
