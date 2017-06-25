'use strict';

var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var chats = fs.readFileSync(__dirname + '/data.json', 'utf8');
console.log(chats);
var chatsCollection;

var createChats = function() {
  chatsCollection.insert(JSON.parse(chats));
};

MongoClient.connect('mongodb://localhost/bottr', function(err, db) {
    console.log('Yayyyy---->Connected to Mongo<-----');
    chatsCollection = db.collection('chats');
    createChats();
});
