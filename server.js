// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

const port = process.env.PORT || 3000;
// Setup Server
const server = app.listen(port,serverRunning);
function serverRunning(){
  console.log(`Server is up and running on port ${port}`);
}


app.post('/submit',submitData);
function submitData(request,response) {
  projectData = {
    Location: request.body.Location,
    Country: request.body.Country,
    CountryCode: request.body.CountryCode,
    Date: request.body.Date,
    Weather: request.body.Weather,
    WeatherIcon: request.body.WeatherIcon,
    Temp: request.body.Temp,
    Content: request.body.Content
  }
  response.send(projectData);
  console.log("Data saved successfully:\n",projectData);
}

app.get('/retreive',retreiveData);
function retreiveData(request,response) {
  response.send(projectData);
}
