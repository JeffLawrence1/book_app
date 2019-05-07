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


// Error Catcher
app.get('*', (request, response) => response.status(404).send('This route does not exist'));


app.listen(PORT, () => console.log(`LISTENING TO EVERYTHING YOU DO!!!!! on port: ${PORT}`));



// Functions
function newSearch(request, response){
  response.render('pages/index');
}
