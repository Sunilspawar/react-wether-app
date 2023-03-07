import React, { useState, useEffect } from 'react';

export function useIsAccuweather(
  periods,
  convertOpenWeatherResponse,
  convertAccuWeatherResponse
) {
  const [isAccuWeather, setIsAccuWeather] = useState(false);

  useEffect(() => {
    // check if accuweather or openweather api response is used
    if (periods && periods.length > 0) {
      if (periods[0].hasOwnProperty('temperature')) {
        setIsAccuWeather(false);
        convertOpenWeatherResponse();
      } else {
        setIsAccuWeather(true);
        convertAccuWeatherResponse();
      }
    }
  }, [periods]);

  return isAccuWeather;
}
