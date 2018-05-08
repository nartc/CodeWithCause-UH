const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')


  // const cropData = JSON.parse(fs.readFileSync('./csvjson.json','utf8'))
  // console.log(cropData)

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/public'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 3200);

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});