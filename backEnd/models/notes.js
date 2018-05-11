/*jshint esversion: 6 */
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let NotesSchema = new Schema({
    time : { type : Date, default: Date.now },
    author: 'string',
    text: 'string'
});

let note = mongoose.model('note',NotesSchema);

module.exports = note;