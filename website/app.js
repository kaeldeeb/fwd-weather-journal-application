/* Global Variables */
// DOM Elements //
const zipCodeInput = document.querySelector('#zip');
const feelingsInput = document.querySelector('#feelings');
const generateButton = document.querySelector('#generate');
const holderEntry = document.querySelector('#holderEntry');
const closeButton = document.querySelector('#holderClose');
const entryLocation=document.querySelector('#location');
const entryDate = document.querySelector('#date');
const entryWeather = document.querySelector('#weather');
const entryTemp = document.querySelector('#temp');
const entryContent = document.querySelector('#content');
const entryFlag = document.querySelector('#flag');

// External APIs //
// 1. Openweather API //
const openweatherAPIKey = "b720c4bb024519f0098bfe048693f2b5";
const openweatherZIP = "http://api.openweathermap.org/data/2.5/weather?zip="
const openweatherCity = "http://api.openweathermap.org/data/2.5/weather?q="
const openweatherIcon = "http://openweathermap.org/img/w/"
// 2. entryFlags API to retreive country flag size 64 pixels //
const entryFlagEndPoint = "https://www.CountryFlags.io/"
const entryFlagParameters = "/flat/64"
// 3. REST API to retreive country full name //
const countryEndPoint = "https://restcountries.eu/rest/v2/alpha/"
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'/'+ d.getDate()+'/'+ d.getFullYear(); // Add 1 to the month to get the correct month
/* End of Global Variables */

////////////////////////////////////////////////////////////////////////////////

/* Helper Functions */
// 1. Function to retreive weather data when user presses Enter //
function pressEnter(event){
  if (event.keyCode === 13) {
    event.preventDefault();
    if (zipCodeInput.value.length!==0){
      generateButton.click();
    }
  }
}

// 2. Smoothly fade out the most recent entry Field via CSS //
function hideEntry(){
  holderEntry.classList.remove("visible");
  holderEntry.classList.add("invisible");
}

// 3. Smoothly fade in the most recent entry field via CSS //
function unhideEntry(){

}

// 4. Clear zip code and feelings text boxes for a new query
function clearFields (){
  document.querySelector('#zip').value=""; // clear the zip code text box, ready for a new weather lookup
  document.querySelector('#feelings').value=""; // clear the feelings text box
  document.getElementById('zip').focus(); // set the focus back to the zip code text box
}

/* End of Helper Functions */

////////////////////////////////////////////////////////////////////////////////

/* Main Functions */
// 1. Fetch weather data from Openweather API and country name from REST API //
async function getOpenweatherData(){
  if (zipCodeInput.value.length===0){ // Alert the user if he leaves the zip code textbox empty
    alert("Error: no zip code or city name.");
    return;
  } else {
    let openweatherEndPoint = ""
    if (!isNaN(zipCodeInput.value.charAt(0))) { // Check the first character to determine if user entered zip code or city name
      openweatherEndPoint = openweatherZIP // First character is number, use the zip code endpoint
    } else {
      openweatherEndPoint = openweatherCity // First character is letter, use the city name endpoint
    }
    const zipCode = zipCodeInput.value; // Get the value of the zip code text box
    // Construct the full openweatherAPI endpoint
    const openweatherAPI = `${openweatherEndPoint}${zipCode}&appid=${openweatherAPIKey}&units=metric`
    const openweatherDataResponse = await fetch (openweatherAPI) // fetch the weather data
    try {
      const openweatherData = await openweatherDataResponse.json();
      if (openweatherData.cod !="404" && openweatherData.cod != "400") { // zip code or city name exists
        // Construct the full REST API endpoint
        const countryNameDataResponse = await fetch (`${countryEndPoint}${openweatherData.sys.country}`) // fetch the full country name
        try {
          const countryNameData = await countryNameDataResponse.json();
          postWeatherData('/submit',{ // post the weather data and country name to the server side
          Location:openweatherData.name, // city name
          Country:countryNameData.name, // country name
          CountryCode:openweatherData.sys.country, // country code to retreive the flag
          Date:newDate, // current date
          Weather:openweatherData.weather[0].main, // current weather status
          WeatherIcon:openweatherData.weather[0].icon, // current weather icon
          Temp:openweatherData.main.temp, // current temperature
          Content:feelingsInput.value // feelings input by user
          });
        } catch (error) {
          console.log("Error: ", error);
        }
      } else { // city or zip code not found, alert the user
        alert(`Error: No location found for zip code/city name ${zipCode}`);
      }
    } catch (error) {
      console.log("Error:",error);
    }
  }
  clearFields();
}

// 2. Post weather data to server side //
async function postWeatherData(url="",data={}){
  const postDataResponse = await fetch (url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type':'application/json'
      },
    body: JSON.stringify(data)
  });
  try {
    const retreivedData = await postDataResponse.json();
    console.log("Data posted to server successfully\n",retreivedData);
    retreiveData();
  } catch(error){
    console.log("Error: ", error)
  }
}

// 3. Retreive weather data from server side and update the corresponding HTML DOM elements //
async function retreiveData() {
  const requestData = await fetch('/retreive')
  try {
    const retreivedData = await requestData.json();
      hideEntry(); // Smoothly hide most recent entry via CSS before updating the HTML DOM elements
      updateUITimeout = setTimeout(function(){ // Update most recent entry fields
        entryLocation.innerHTML= `${retreivedData.Location}, ${retreivedData.Country}`;
        entryDate.innerHTML=`Date: ${retreivedData.Date}`;
        entryWeather.innerHTML=`Weather: ${retreivedData.Weather} &nbsp<img src=${openweatherIcon}${retreivedData.WeatherIcon}.png alt="weahter icon" style="vertical-align:bottom" height="30">`;
        entryTemp.innerHTML=`Temperature : ${retreivedData.Temp} °C`;
        entryContent.innerHTML=`Feelings : ${retreivedData.Content}`;
        entryFlag.innerHTML=`<img src=${entryFlagEndPoint}${retreivedData.CountryCode}${entryFlagParameters}.png alt="Flag">`
        clearTimeout(updateUITimeout);
      },500); // Update HTML DOM after 500 milliseconds/transition completes.
      unhideEntryTimeout = setTimeout(function(){
        holderEntry.classList.remove("invisible");
        holderEntry.classList.add("visible");
        entryContent.scrollIntoView({behavior:"smooth"}); // scroll the weather data into view
        clearTimeout(unhideEntryTimeout);
      },500); // Smoothly show the most recent entry after updaing its contents
  } catch (error) {console.log("Error: ",error);
  }
}

/* End of main functions */

////////////////////////////////////////////////////////////////////////////////

/* Event Listeners */
zipCodeInput.addEventListener("keyup",pressEnter); // Detects when user hits enter after entering zip code / city name
feelingsInput.addEventListener("keyup",pressEnter); // Detects when user hits enter after entering feelings
generateButton.addEventListener("click",getOpenweatherData); // Detects when user clicks the generate button
closeButton.addEventListener("click",hideEntry); // Detects when user click the close button
/* End of Event Listeners */

// Set focus to the zip code text box //
window.onload = function() {
  var input = zipCodeInput.focus();
}
