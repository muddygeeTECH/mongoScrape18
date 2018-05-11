const express = require('express');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request');
const bodyParser = require('body-parser');
const info = require('./models/emberInfo.js');
const note = require('./models/notes.js');

let app = express();

mongoose.Promise = Promise;

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost/InfoEmber');
let db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});
app.get("/scrape", function(req, res) {
  request("https://emberigniter.com/articles/", function(error, response, html) {
    let $ = cheerio.load(html);
    $("article .wrapper ul li").each(function(i, element) {
      console.log('element: ',element);
      let result = {};
      result.title = $(this).children("a").text();
      console.log('title: ',result.title);
      result.date = $(this).children("strong").text();
      console.log('date: ',result.date);
      result.link = $(this).children("a").attr("href");
      console.log('link: ',result.link);
      let entry = new info(result);
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Scrape Complete");
});
app.get('/api',function(req,res) {
	res.send('Working');
});
app.get('/api/infos', function(req, res) {
  info.find({}, function(err, docs) {
    if (err) {
      res.send({err:err});
    }
    else {
      console.log(docs);
      res.send(docs);
    }
  });
});
app.post("/api/infos/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  let newNote = new note(req.body);
    console.log(newNote);
    // And save the new note the db
 newNote.save(function(error, doc) {
   // Log any errors
   if (error) {
     console.log(error);
   }else {
      // Use the article id to find and update it's note
      info.update({ "_id": req.body.id }, {$push:{comment:{$each: [doc]/*, $position: 0*/}}})
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});
app.listen("4500", function(){
  console.log("App running on port 4500!");
});
