import React, { useState } from 'react';
import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  mphToKmh,
  kmhToMph
} from '../utils/converters';
import { isSafari } from '../utils/browsers';
import store from '../redux/store';

import './ForecastCard.scss';

export default function ForecastCard({ forecast }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [temperature, setTemperature] = useState('c');
  const [windSpeed, setWindSpeed] = useState('kmh');
  // console.log(forecast);

  store.subscribe(() => {
    const { units } = store.getState();
    if (units.temperature !== temperature) {
      setTemperature(units.temperature);
    }
    if (units.windSpeed !== windSpeed) {
      setWindSpeed(units.windSpeed);
    }
  });

  const getTemperature = (temp, unit) => {
    switch (unit) {
      case 'F':
        if (temperature === 'c') {
          return <span>{fahrenheitToCelsius(temp).toFixed(2)} &#176;C</span>;
        } else {
          return <span>{temp} F</span>;
        }
      case 'C':
        if (temperature === 'c') {
          return <span>{temp} &#176;C</span>;
        } else {
          return <span>{celsiusToFahrenheit(temp).toFixed(2)} F</span>;
        }
      default:
        return (
          <span>
            {temp} {unit}
          </span>
        );
    }
  };

  const getWind = (speed, direction) => {
    let speedStr = speed;
    if (speed.includes('mph') && windSpeed === 'kmh') {
      speedStr = replaceAllWindsInString(speedStr);
    } else if (speed.includes('kmh') && windSpeed === 'mph') {
      speedStr = replaceAllWindsInString(speedStr);
    }

    return (
      <div className="wind">
        <span>{direction}</span>
        <span>{speedStr}</span>
      </div>
    );
  };

  const replaceAllTempsInString = tempStr => {
    if (temperature === 'c') {
      const temps = tempStr.match(/\d+/g);
      for (let i = 0; i < temps.length; i++) {
        tempStr = tempStr.replace(temps[i], i);
      }
      for (let i = 0; i < temps.length; i++) {
        tempStr = tempStr.replace(i, Math.floor(fahrenheitToCelsius(temps[i])));
      }
    } /*else if (temperature === 'f') {
      const temps = tempStr.match(/\d+/g);
      for (let i = 0; i < temps.length; i++) {
        tempStr = tempStr.replace(temps[i], i);
      }
      for (let i = 0; i < temps.length; i++) {
        tempStr = tempStr.replace(i, Math.floor(celsiusToFahrenheit(temps[i])));
      }
    }*/

    return tempStr;
  };

  const replaceAllWindsInString = windStr => {
    if (windSpeed === 'kmh' && windStr.includes('mph')) {
      const winds = windStr.match(/\d+/g);
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(winds[i], i);
      }
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(i, Math.floor(mphToKmh(winds[i])));
      }
      windStr = windStr.replace('mph', 'km/h');
    } else if (windSpeed === 'mph' && windStr.includes('kmh')) {
      const winds = windStr.match(/\d+/g);
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(winds[i], i);
      }
      for (let i = 0; i < winds.length; i++) {
        windStr = windStr.replace(i, Math.floor(kmhToMph(winds[i])));
      }
      windStr = windStr.replace('km/h', 'mph');
    }

    return windStr;
  };

  const getDetailedForcast = details => {
    let tempStr = '';
    let windStr = '';
    const firstMphIdx = details.indexOf('mph');
    // contains wind info
    if (firstMphIdx > -1) {
      const lastDotIdx = details.substr(0, firstMphIdx).lastIndexOf('.');
      // contains wind and temperature info
      if (lastDotIdx > -1) {
        tempStr = details.substr(0, lastDotIdx + 1);
        windStr = details.substr(lastDotIdx + 2, details.length);
        tempStr = replaceAllTempsInString(tempStr);
        windStr = replaceAllWindsInString(windStr);
        // contains only wind info
      } else {
        windStr = replaceAllWindsInString(details);
      }
      // contains only temperature info
    } else {
      tempStr = replaceAllTempsInString(details);
    }

    return `${tempStr} ${windStr}`;
  };

  const setFlippedState = (state, isClick) => {
    if (isClick) {
      setIsFlipped(state);
    } else if (!isSafari) {
      setIsFlipped(state);
    }
  };

  return (
    <div
      className={isFlipped ? 'forecast-container flip' : 'forecast-container'}
    >
      <div className={isSafari ? 'inner is-safari' : 'inner'}>
        <div className="front">
          <div className="name">{forecast.name}</div>
          <img
            className="icon"
            src={forecast.icon}
            alt={forecast.shortForecast}
          />
          <div className="short">{forecast.shortForecast}</div>
          <div className="temperature">
            {getTemperature(forecast.temperature, forecast.temperatureUnit)}
          </div>
          {getWind(forecast.windSpeed, forecast.windDirection)}
          <div
            className="more"
            onClick={() => setFlippedState(true, true)}
            onMouseOver={() => setFlippedState(true, false)}
          >
            more
          </div>
        </div>
        <div className="back" onMouseOut={() => setFlippedState(false, false)}>
          <span className="long">
            {getDetailedForcast(forecast.detailedForecast)}
          </span>
          {isSafari && (
            <div className="less" onClick={() => setFlippedState(false, true)}>
              less
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
