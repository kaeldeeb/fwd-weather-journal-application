# FWD Weather Journal Application
##### Programmed by : Karim El-Deeb

## Table of Contents

* [Project Title](#project-title)
* [Programmer](#programmer)
* [Description](#description)
* [Project Architecture](#project-architecture)
* [Technologies](#technologies)
* [Dependencies](#dependencies)
* [Design](#design)
* [How to Use](#how-to-use)

***

## Project Title


Weather Journal Application


## Programmer

Karim El-Deeb


## Description

This is a  webpage project with the following features:

* Fetching weather data from external API (openweathermap.org)
* Fetching country flags from external API (countryflags.io)
* Fetching full country name from external API (restcountries.eu)
* Searching for weather by either zip code or city name
* Posting the weather data back to server.js via POST
* Retreiving the most recent entry from server via GET
* Responsive page design
* Smooth scrolling

## Project Architecture

This project contains the following files and folders:

* website [folder]
  * app.js
  * background.jpeg
  * favicon.ico
  * index.html
  * style.css  
* package.json
* package-lock.json
* server.js
* readme.md


## Technologies

This project is built using javascript, HTML5 and CSS3 for the client side, and node.js for the server side.


## Dependencies

The following modules are essential to run the server side node.js code

* `express`
* `body-parser`
* `cors`

These are included in the `package.json` and they should be installed via the npm command line before running the server 

## Design

The webpage was designed using CSS and free background and favicon and is suitable to view on different devices.


## How to Use

1. First, run the server on the local machine. Navigate to the folder where the applicatoin is downloaded and in the node.js command line type: node server.js
2. You should see a message confirming that the server is up and running
3. Open the web browser and navigate to the following address localhost:3000/
4. Enter the zip code or city name in the first text box
5. Enter your feelings about the weather condition (optional)
6. Click 'generate' or simply hit the `Enter` key
7. The weather data is displayed with the city name, country name, country flag and date
