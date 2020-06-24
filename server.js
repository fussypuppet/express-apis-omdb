require('dotenv').config();
const axios = require('axios');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const db = require('./models');
const fs = require('fs');

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static(__dirname + '/static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

function errorHandler(error) {
  console.log("🟥🟥🟥🟥 Error! 🟥🟥🟥🟥");
  console.log(error);
}

// Routes
app.get('/', (req,res) => {
  res.render("");
})

app.get('/results', (req,res) => {
  //console.log( `Sending API requesat to http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${req.query.q}`);
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${req.query.q}`)
  .then(function(response){
    //console.log(response.data);
    let queryResults = response.data.Search;
    res.render('results', {queryResults});
  }).catch(errorHandler);
})

app.get('/movies/:id', (req,res) => {
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${req.params.id}`)
  .then(function(response){
    let thisResult = response.data;
    res.render('detail', {thisResult})
  }).catch(errorHandler);
})

app.post('/faves', (req, res) => {
  db.fave.create({
    title: req.body.title,
    imdbid: req.body.imdbid
  }).then(addedFave => {
    console.log(`🧮🧮 fave ${addedFave.title} added 🧮🧮`);
    res.redirect(`/faves`);
  }).catch(errorHandler);
})
app.get('/faves', (req, res) => {
  db.fave.findAll()
    .then(faves => {
      res.render('faves', {faves});
    }).catch(errorHandler);
})


/*app.get('/', function(req,res){
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=Star+Wars`)
      .then(function(response){
          //let queryResponse = stringify(response);
          let result = response.data;
          res.send(result);
      }).catch(function(err){
          console.log(err);
      })
})
*/
// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
