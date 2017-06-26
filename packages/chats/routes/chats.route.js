'use strict';

const chats = require('../controllers/chats.controller');

module.exports = (app) => {

  app.route('/api/chat')
    //Uncomment this for mongodb version
    //.post(chats.chat)

    //Elasticsearch version
    .post(chats.elasticChat)
    .get(chats.history);

  /*app.route('/api/chats')
    .get(chats.list)
    .post(chats.create);

  app.route('/api/chats/:chatid')
    .get(chats.read)
    .put(chats.update)
    .delete(chats.delete);*/
};
