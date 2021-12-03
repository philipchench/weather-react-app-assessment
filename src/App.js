import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const apiKey = "d918fb09ac8966283f0131e75067b145"
const apiLink = "https://api.openweathermap.org/data/2.5/"

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});//current weather JSON
  const [isDay, setIsDay] = useState();//day or night of searched city
  const [forecast, setForecast] = useState();//descriptive weather in 3 hours
  const [week, setWeek] = useState([]);//array of 7 arrays, containing day of week, temps, description

  const onSubmit = async (e) => {
    e.preventDefault();

    if(city === ''){
      return
    }

    try{
      const res = await fetch(`${apiLink}weather?q=${city}&units=metric&APPID=${apiKey}`);//fetch current weather
      const resData = await res.json();
      setWeather(resData);
      setCity('');//reset search bar
      if(resData.dt > resData.sys.sunrise && resData.dt < resData.sys.sunset){
        setIsDay(1);//set to 1 if daytime
      }else{
        setIsDay(0);//set to 0 if night
      }
      const resFC = await fetch(`${apiLink}onecall?lat=${resData.coord.lat}&lon=${resData.coord.lon}&exclude=current,minutely,alerts&units=metric&appid=${apiKey}`);
      // ^^ fetch detailed forecast by GPS coord (provided by current weather search)
      const resFCData = await resFC.json();
      setForecast(resFCData.hourly[3].weather[0].main)//short term forecast description in 3 hours
      
      let tempWeek = [];
      for(let i = 1; i < 8; i++){//add day of week, day/night temp, and weather to array
        let epoch = resFCData.daily[i].dt;
        let iDate = new Date(epoch*1000);
        let iDay = days[iDate.getDay()];
        let dayTemp = Math.round(resFCData.daily[i].temp.day)
        let nightTemp = Math.round(resFCData.daily[i].temp.night)
        let iWeather = resFCData.daily[i].weather[0].main;
        tempWeek.push([iDay, dayTemp, nightTemp, iWeather]);
      }
      setWeek(tempWeek)//set our weekly forecast

    }catch(err){
      alert("Can't find city or partial data missing.")
    }
  }

  if(typeof weather.main != "undefined"){
    if(weather.main.temp > 16){
      if(isDay){
        document.body.style.backgroundImage = "url('bg/bgwarmday.jpg')";
      }else{
        document.body.style.backgroundImage = "url('bg/bgwarmnight.jpg')";
      }
    }else{
      if(isDay){
        document.body.style.backgroundImage = "url('bg/bgcoldday.jpg')";
      }else{
        document.body.style.backgroundImage = "url('bg/bgcoldnight.jpg')";
      }
    }
  }


  return (
    <div className={(typeof weather.main != "undefined" && !isDay) ? 'app night' : 'app'}>
      <div className='content'>
      <nav className = "navbar">
        <label>React Weather App</label>
      </nav>
      
      <form className = "search" onSubmit={onSubmit}>
            <input
              type='text'
              placeholder='Enter city...'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input type='submit' value='Search' />
        </form>

        {(typeof weather.main != "undefined") ? (
        <div className="allWeatherBox">
          <div className="currWeatherBox">
            <div className="location">{weather.name} {weather.sys.country}</div>
            <div className="currTemp">
              {Math.round(weather.main.temp)}°c
            </div>
            <label >Forecasted Weather</label>
            <div className="currWeather">
              {weather.weather[0].main}
            </div>
            <label >Forecasted Weather</label>
            <div className="shortForecast">{forecast}</div>
          </div>
          <div className="weekForecastBox">
            <ul>
              {week.map(x => 
              <li className = "weekForecastItem" key={x}>
                <label>{x[0]}</label>
                  <p>Day: {x[1]}°c, Night: {x[2]}°c, {x[3]}</p>
              </li>)}
            </ul>
          </div>
        </div>
        ) : (
          ''
        )}

      </div>

    </div>
  );
}

export default App;
