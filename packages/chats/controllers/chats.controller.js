'use strict';

const async = require('async');
const mongoose = require('mongoose');
const Chat = mongoose.model('Chat');
const History = mongoose.model('History');

exports.history = (req, res) => {
  History.find({}).sort({
    timestamp: 1
  }).exec((err, history) => {
    if (err) {
      return res.status(501).json();
    }
    console.log('history', history);
    res.json(history);
  });
};

exports.chat = (req, res) => {
  var chats;
  async.series([
    (fn) => {
      Chat.find({
        question: req.body.chat
      }, (err, c) => {
        if (err) {
          return fn(501);
        }
        chats = c;
        console.log('chats1', chats);
        return fn(null);
      });
    },
    (fn) => {
      History.create({
        question: req.body.chat,
        user: 'me'
      }, (err) => {
        if (err) {
          return fn(501);
        }
        return fn(null);
      });
    },
    (fn) => {
      if (chats.length) {
        return fn(null);
      } else {
        Chat.find({
          $text: {
            $search: req.body.chat
          }
        }, {
          score: {
            $meta: 'textScore'
          } 
        }).sort({
          score: {
            $meta : 'textScore'
          }
        }).exec((err, c) => {
          if (err) {
            return fn(501);
          }
          chats = c;
          console.log('chats2', chats);
          return fn(null);
        });
      }
    },
    (fn) => {
      if (chats.length) {
        return fn(null);
      } else {
        chats = [{
          question: req.body.chat,
          answer: 'I don\'t know this.'
        }];
        return fn(null);
      }
    },
    (fn) => {
      History.create({
        response: chats,
        user: 'bot'
      }, (err) => {
        if (err) {
          return fn(501);
        }
        return fn(null);
      });
    },
  ], (err) => {
    if (err) {
      return res.status(err).json();
    }
    return res.json(chats);
  });
};