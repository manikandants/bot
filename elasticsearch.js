const elasticsearch = require('elasticsearch');

exports.client = new elasticsearch.Client({
  host: 'https://5582488be46c7defa97e5f5bd69a1451.ap-southeast-1.aws.found.io:9243',
  log: 'trace'
});