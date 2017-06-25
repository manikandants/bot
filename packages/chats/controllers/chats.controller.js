'use strict';

const async = require('async');
const mongoose = require('mongoose');
const Chat = mongoose.model('Chat');

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
    }
  ], (err) => {
    if (err) {
      return res.status(err).json();
    }
    res.json(chats);
  });
};