const express = require('express');
const app = express();
const path = require('path');

// Settings 
app.set('port', process.env.PORT || 3000);

// Public content
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
module.exports = app;