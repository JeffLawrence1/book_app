'use strict';

// App Dependencies
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const methodOverride = require('method-override');

// App Setup
const app = express();
const PORT = process.env.PORT || 3000;

// App Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    console.log(req.body._method);
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//DataBase Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Set view engine for server side templating
app.set('view engine', 'ejs');

// Routes
app.get('/searches/new', newSearch);
app.post('/searches', performSearch);
app.post('/book', addDB);
app.get('/', loadPage);
app.get('/error', errorPage);
app.get('/books/:id', getBook);

// Error Catcher
app.get('*', (request, response) => response.status(404).send('This route does not exist'));


app.listen(PORT, () => console.log(`LISTENING TO EVERYTHING YOU DO!!!!! on port: ${PORT}`));


// Book Constructor
function Book(info) {
  //We may need this later: console.log(info.imageLinks.thumbnail);
  let image = urlCheck(info.imageLinks.thumbnail);
  this.author = info.authors || 'No author available';
  this.title = info.title || 'No title available';
  this.isbn = info.industryIdentifiers[0].identifier || 'No ISBN present';
  this.image_url = image || 'https://i.imgur.com/e1yYXUU.jpg';
  this.description = info.description || 'No description available';
  this.bookshelf = 'select bookshelf';
}

const urlCheck = (data) => {
  if(data.indexOf('https') === -1){
    let newData = data.replace('http', 'https');
    return newData;
  }else{
    return data;
  }
};

// Functions
function newSearch(request, response){
  response.render('pages/searches/new');
}

function performSearch(request, response){

  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(books => response.render('pages/searches/show', {searchResults: books}))
    .catch(errorPage);
}

function loadPage (request, response) {
  let SQL = 'SELECT * FROM books;';


  return client.query(SQL)
    //console.log(SQL)
    // .then (results => console.log({result: results.rows, bookCount: results.rows.length}))
    .then (results => response.render('pages/index', {result: results.rows, bookCount: results.rows.length}))
    .catch (err => errorPage(err, response));
}

function getBook(request, response){
  let SQL = `SELECT * FROM books WHERE id=$1;`;
  //console.log(request.params);
  let values = [request.params.id];

  return client.query(SQL, values)
    .then(result => {
      response.render('pages/books/show', {results: result.rows[0]});
    })
    .catch (err => errorPage(err, response));
}


function addDB(request, response){
  // console.log(request);
  let { author, title, isbn, image_url, description, bookshelf} = request.body;

  let SQL = 'INSERT INTO books(author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
  let values = [author, title, isbn, image_url, description, bookshelf];
 
  return client.query(SQL, values)
    .then(results => response.redirect(`/books/${results.rows[0].id}`))
    .catch (err => errorPage(err, response));
}

function errorPage(error, response){
  response.render('pages/error', {error: 'OH nO!'});
}
