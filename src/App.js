import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';


const apiKey = "d918fb09ac8966283f0131e75067b145"
const apiLink = "https://api.openweathermap.org/data/2.5/"

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault()

    try{
      const res = await fetch(`${apiLink}weather?q=${city}&units=metric&APPID=${apiKey}`)
      const resData = await res.json()
      console.log(resData)
    }catch(err){

    }


  }


  return (
    <div className="App">
      <form className = "search" onSubmit={onSubmit}>
            <label>Search city</label>
            <input
              type='text'
              placeholder='Enter city...'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input type='submit' value='Search' />
        </form>

        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            {/* <div className="date">{dateBuilder(new Date())}</div> */}
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </div>
        ) : (
          ''
        )}

    </div>
  );
}

export default App;
