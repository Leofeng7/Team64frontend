import React, {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout({children}) {

  const [weather, setWeather] = useState('');
  const [currTemp, setCurrTemp] = useState(0);
  const [highTemp, setHighTemp] = useState(0);
  const [lowTemp, setLowTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Calls weather API once upon mounting to retrieve current weather data.
   * @function
   * @name useWeather
   * @returns {null}
   */
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=30.628&lon=-96.334&units=imperial&appid=703f1d8f031ba9041b4de2e90e795853')
    xhr.send();
    xhr.onload = () => {
      {/* Set data from API call locally */}
      const data = JSON.parse(xhr.response);
      setWeather(JSON.parse(JSON.stringify(data['weather'][0]))['description']);
      setCurrTemp(JSON.parse(JSON.stringify(data['main']))['temp']);
      setHighTemp(JSON.parse(JSON.stringify(data['main']))['temp_max']);
      setLowTemp(JSON.parse(JSON.stringify(data['main']))['temp_min']);
      setHumidity(JSON.parse(JSON.stringify(data['main']))['humidity']);
      console.log(data)
    };
  }, []);

  return (
    <div>
      <header>
        <nav className="navbar navbar-light bg-secondary">
          <div className="container">
            <img
              src="https://skprod.objects.frb.io/images/static/smoothie-king-logo.svg"
              className="smoothie-logo"
            />
            <a href="/" className="navbar-brand" style={{marginRight: '30px'}}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/271/271218.png?w=740&t=st=1683010785~exp=1683011385~hmac=abb8b250bf85129a9fe2483fd5503081235a550e79ccf9204d52f767d1df201e"
                className="navbar-arrow"
                alt="Back to Login"
              />
            </a>
            <div className="weather-details-container">
              <div
                className="weather-icon"
                onClick={() => setShowDetails(!showDetails)}
              >
                {currTemp}°F
              </div>
              {showDetails && (
                <div className="weather-details">
                  <div className="weather-detail small">Weather: {weather}</div>
                  <div className="weather-detail small">Humidity: {humidity}</div>
                  <div className="weather-detail small">
                    Low/High: {lowTemp}°F / {highTemp}°F
                  </div>
                  <button
                    className="close-button"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main>
        <div className="container mt-3">{children}</div>
        <ToastContainer />
      </main>
    </div>
  );
  
}

export default MainLayout
