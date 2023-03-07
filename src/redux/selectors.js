import { compareCoordinates } from "../utils/compare";

export const getTemperature = (store) =>
  store && store.units ? store.units.temperature : "";

export const getWindSpeed = (store) =>
  store && store.units ? store.units.windSpeed : "";

export const getPrecipitation = (store) =>
  store && store.units ? store.units.precipitation : "";

export const getLanguage = (store) =>
  store && store.units ? store.units.language : "en";

export const getUseAccuweather = (store) =>
  store && store.units ? store.units.useAccuWeatherApi : true;

export const getForecasts = (store) =>
  store && store.forecast ? store.forecast.forecasts : {};

export const getLatestForecast = (store) => {
  if (store && store.forecast) {
    const keys = Object.keys(store.forecast.forecasts);
    if (keys.length === 1) {
      return store.forecast.forecasts[keys[0]];
    }
    let latestForecast = store.forecast.forecasts[keys[0]];
    for (let i = 1; i < keys.length; i++) {
      let prevForecast = store.forecast.forecasts[keys[i - 1]];
      let currForecast = store.forecast.forecasts[keys[i]];
      if (currForecast.savedAt > prevForecast.savedAt) {
        latestForecast = currForecast;
      }
    }
    return latestForecast;
  }

  return null;
};

export const getLatestForecastLocation = (store) => {
  const latestForecast = getLatestForecast(store);
  if (latestForecast && store && store.locations) {
    const keys = Object.keys(store.locations.locations);
    const { geometry } = latestForecast;
    let latestForecastLocation;
    for (let i = 0; i < keys.length; i++) {
      let locations = store.locations.locations[keys[i]];
      for (let j = 0; j < locations.length; j++) {
        if (latestForecastLocation) {
          break;
        }
        let location = locations[j];
        if (
          geometry.lat === location.geometry.lat &&
          geometry.lng === location.geometry.lng
        ) {
          latestForecastLocation = location;
          break;
        }
      }
    }

    return latestForecastLocation;
  }

  return null;
};

export const getNearestLocationByGeometry = (store, geometry) => {
  if (store && store.locations) {
    const keys = Object.keys(store.locations.locations);
    for (let i = 0; i < keys.length; i++) {
      let locations = store.locations.locations[keys[i]];
      for (let j = 0; j < locations.length; j++) {
        if (compareCoordinates(geometry, locations[j].geometry)) {
          return locations[j];
        }
      }
    }
  }

  return null;
};

export const getForecastByGeometry = (store, geometry) => {
  const key = `${geometry.lat},${geometry.lng}`;
  return store && store.forecast && store.forecast.forecasts[key]
    ? store.forecast.forecasts[key]
    : null;
};

export const getLoationsBySearchTerm = (store, term) => {
  if (store && store.locations && store.locations.locations[term]) {
    return store.locations.locations[term];
  }

  return null;
};

export const getPinnedLocationNames = (store) => {
  if (store && store.locations && store.locations.pinnedLocations) {
    store.locations.pinnedLocations.map((l) => l.name);
  }

  return [];
};

export const getCurrentConditions = (store) => {
  if (store && store.forecast && store.forecast.currentConditions) {
    return store.forecast.currentConditions;
  }

  return null;
};

export const getHourByHourForecast = (store) => {
  if (store && store.forecast && store.forecast.hourByHourForecast) {
    return store.forecast.hourByHourForecast;
  }

  return null;
};
