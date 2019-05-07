'use strict';

// App Dependencies
const express = require('express');
const superagent = require('superagent');

// App Setup
const app = express();
const PORT = process.env.PORT || 3000;

// App Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Set view engine for server side templating
app.set('view engine', 'ejs');

// Routes
app.get('/', newSearch);
app.post('/searches', performSearch);

// Error Catcher
app.get('*', (request, response) => response.status(404).send('This route does not exist'));


app.listen(PORT, () => console.log(`LISTENING TO EVERYTHING YOU DO!!!!! on port: ${PORT}`));


// Book Constructor
function Book(info) {
  // console.log(info.description);
  let image = urlCheck(info.imageLinks.thumbnail);
  this.image_url = image || 'https://i.imgur.com/e1yYXUU.jpg';
  this.title = info.title || 'No title available';
  this.author = info.authors || 'No author available';
  this.description = info.description || 'No description available';
}

const urlCheck = (data) => {
  if(!data.slice(0, 5) === 'https'){
    data.replace(/^http:\/\//i, 'https://');
    return data;
  }else{
    return data;
  }
};

// Functions
function newSearch(request, response){
  response.render('pages/index');
}

function performSearch(request, response){
  // console.log(request.body);
  // console.log(request.body.search);
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;

  superagent.get(url)
    .then(apiResponse =>  apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(books => response.render('pages/searches/show', {searchResults: books}))
    .catch(console.error);
}
