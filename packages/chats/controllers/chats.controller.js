'use strict';

const async = require('async');
const mongoose = require('mongoose');
const Chat = mongoose.model('Chat');
const History = mongoose.model('History');
const elasticsearch = require('../utils/elasticsearch');
const chatsUtil = require('../utils/chats.util');
const _ = require('lodash');

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

exports.elasticChat = (req, res) => {
  var chats;
  async.series([
    (fn) => {
      chatsUtil.addHistory({
        question: req.body.chat,
        user: 'me',
        timestamp: new Date()
      }, fn);
    },
    (fn) => {
      elasticsearch.client.search({
        q: req.body.chat
      }).then((body) => {
        var hits = body.hits.hits;
        chats = _.map(hits, (hit) => {
          return hit._source;
        });
        return fn(null);
      }, (error) => {
        console.trace(error.message);
        return fn(null);
      });
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
      chatsUtil.addHistory({
        response: chats,
        user: 'bot',
        timestamp: new Date()
      }, fn);
    }
  ], (err) => {
    if (err) {
      return res.status(err).json();
    }
    return res.json(chats);
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
      chatsUtil.addHistory({
        question: req.body.chat,
        user: 'me',
        timestamp: new Date()
      }, fn);
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
      chatsUtil.addHistory({
        response: chats,
        user: 'bot',
        timestamp: new Date()
      }, fn);
    }
  ], (err) => {
    if (err) {
      return res.status(err).json();
    }
    return res.json(chats);
  });
};