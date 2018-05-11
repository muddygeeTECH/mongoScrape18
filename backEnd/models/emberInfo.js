/*jshint esversion: 6 */
const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let EmberInfo = new Schema({
  title: 'string',
  date: 'string',
  link: 'string',
  comment: [{
    time: {
      type: Date,
      default: Date.now
    },
    author: 'string',
    text: 'string'
  }]
});

let info = mongoose.model("info", EmberInfo);

module.exports = info;
