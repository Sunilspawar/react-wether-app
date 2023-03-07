import { take, select, call, put, fork } from "redux-saga/effects";
import {
  getLatestForecast,
  getLatestForecastLocation,
  getNearestLocationByGeometry,
  getForecastByGeometry,
  getUseAccuweather,
  getForecasts,
  getCurrentConditions,
  getHourByHourForecast,
  getLanguage
} from "../redux/selectors";
import { getGeoByIp } from "../services/GeoLocationService";
import { getNearestCities } from "../services/ReverseGeoCodeService";
import { compareCoordinates } from "../utils/compare";
import { getLocattionByCityName } from "../services/OpenCageService";
import { transformLocationData } from "../utils/data-transformer";
import {
  datesAreOnSameDay,
  dateOlderThanGivenDays,
  dateOlderThanGivenHours
} from "../utils/date";
import { getWeatherByCoordinates } from "../services/OpenWeatherService";
import {
  getLocationIdByGeoposition,
  getForecastByLocationKey,
  getCurrentConditionsByLocationKey,
  get12HourForecastByLocationKey
} from "../services/AccuWeatherService";
import {
  LOAD_FORECAST,
  SET_CURRENT_FORECAST,
  GET_WEATHER_BY_GEOMETRY,
  SET_CURRENT_LOCATION,
  LOCATION_CLICKED,
  SET_LOCATION,
  SET_FORECAST,
  CLEAR_FORECASTS,
  DELETE_FORECASTS_BY_KEY,
  SET_CURRENT_CONDITION,
  REFRESH_CURRENT_CONDITION,
  SET_LOADER,
  SET_HOUR_BY_HOUR_FORECAST
} from "../redux/actionTypes";


function* loadForecastSaga() {
  yield take(LOAD_FORECAST);
  yield put({ type: SET_LOADER, payload: { showLoader: true } });
  const latestForecast = yield select(getLatestForecast);
  const latestForecastLocation = yield select(getLatestForecastLocation);
  if (latestForecast && latestForecastLocation) {
    console.log(
      `[S] previous forecast available for ${
        latestForecastLocation.formatted
      }, loading it from store (${new Date(latestForecast.savedAt)})`
    );
    yield call(setFromLatestSaga, latestForecast, latestForecastLocation);
  } else {
    yield call(getLocationsByIPSaga);
  }
}


function* setFromLatestSaga(latestForecast, latestForecastLocation) {
  yield put({
    type: SET_CURRENT_FORECAST,
    payload: { forecast: latestForecast, geometry: latestForecast.geometry }
  });
  const location = yield call(transformLocationData, latestForecastLocation);
  yield put({ type: SET_CURRENT_LOCATION, payload: { location } });
  const sameDay = yield call(todaySaga, latestForecast.savedAt);
  if (!sameDay) {
    console.log(
      `[S] loaded forecast is too old (${new Date(
        latestForecast.savedAt
      )}), refreshing it automatically`
    );
    yield put({
      type: GET_WEATHER_BY_GEOMETRY,
      payload: latestForecastLocation.geometry
    });
  } else {
    yield put({ type: SET_LOADER, payload: { showLoader: false } });
  }
}


function* getLocationsByIPSaga() {
  const geo = yield call(getGeoByIp);
  const foundLocation = yield select(getNearestLocationByGeometry, geo);
  if (foundLocation) {
    console.log(
      `[S] found location ${foundLocation.formatted} by geometry in store, loading it`
    );
    yield put({ type: LOCATION_CLICKED, payload: foundLocation });
  } else {
    yield call(reverseGeocodingSaga, geo);
  }
}


function* reverseGeocodingSaga(geometry) {
  const nearestCities = yield call(
    getNearestCities,
    geometry.lat,
    geometry.lng
  );
  let reverseGeoLocation;
  for (const city of nearestCities) {
    const cityGeo = { lat: city.Latitude, lng: city.Longitude };
    const match = yield call(compareCoordinates, geometry, cityGeo);
    if (match) {
      console.log(
        `[S] nearest cities for geometry: ${geometry.lat},${geometry.lng} found`
      );
      reverseGeoLocation = city;
      break;
    }
  }
  reverseGeoLocation = reverseGeoLocation
    ? reverseGeoLocation
    : nearestCities[0];
  const locationByCityName = yield call(
    getLocattionByCityName,
    reverseGeoLocation.City
  );
  yield put({
    type: SET_LOCATION,
    payload: {
      details: {
        term: reverseGeoLocation.City.toLowerCase(),
        results: locationByCityName.results
      }
    }
  });
  console.log(`[S] setting location to ${reverseGeoLocation.City}`);
  yield put({
    type: LOCATION_CLICKED,
    payload: locationByCityName.results[0]
  });
}

/**
 * Wait for LOCATION_CLICKED action. Set the current location to the payload.
 * Get the saved forecast for the location. If the forecast is not older than 1 day,
 * set it from store as current forecast. Else get a fresh one from API.
 * Else if no saved forecast is available, get it from API.
 * API call means calling GET_WEATHER_BY_GEOMETRY action.
 */
function* locationClickedSaga() {
  while (true) {
    const { payload: details } = yield take(LOCATION_CLICKED);
    yield put({ type: SET_LOADER, payload: { showLoader: true } });
    let location;
    if (details.annotations) {
      location = yield call(transformLocationData, details);
    } else {
      location = details;
    }
    yield put({ type: SET_CURRENT_LOCATION, payload: { location } });
    const savedForecast = yield select(getForecastByGeometry, details.geometry);
    if (savedForecast) {
      const sameDay = yield call(todaySaga, savedForecast.savedAt);
      if (sameDay) {
        console.log("[S] loading forecast from store", savedForecast.geometry);
        yield put({
          type: SET_CURRENT_FORECAST,
          payload: {
            forecast: savedForecast,
            geometry: savedForecast.geometry
          }
        });
        yield put({ type: SET_LOADER, payload: { showLoader: false } });
      } else {
        console.log(
          "[S] getting forecast from api - data too old in store",
          details.geometry
        );
        yield put({
          type: GET_WEATHER_BY_GEOMETRY,
          payload: details.geometry
        });
      }
    } else {
      console.log(
        "[S] getting forecast from api by geometry",
        details.geometry
      );
      yield put({ type: GET_WEATHER_BY_GEOMETRY, payload: details.geometry });
    }
  }
}

/**
 * Wait for GET_WEATHER_BY_GEOMETRY action containing the geometry.
 * Check which api needs to be used. Call the proper API with geometry parameter.
 */
function* getWeatherByGeometrySaga() {
  while (true) {
    const { payload: geometry } = yield take(GET_WEATHER_BY_GEOMETRY);
    yield put({ type: SET_LOADER, payload: { showLoader: true } });
    const useAccuWeather = yield select(getUseAccuweather);
    if (useAccuWeather) {
      yield call(getAccuWeatherSaga, geometry);
    } else {
      yield call(getOpenWeatherSaga, geometry);
    }
  }
}

/**
 * Call open weather API with geometry, set it as current forecast
 * by calling SET_CURRENT_FORECAST action.
 * @param {*} geometry
 */
function* getOpenWeatherSaga(geometry) {
  try {
    const forecast = yield call(
      getWeatherByCoordinates,
      geometry.lat,
      geometry.lng
    );
    yield put({
      type: SET_CURRENT_FORECAST,
      payload: { forecast, geometry }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get forecast for`, geometry);
  } finally {
    yield put({ type: SET_LOADER, payload: { showLoader: false } });
  }
}

/**
 * Get locationId from geometry by calling API. After that get forecast by locationId from
 * accuweather API and set it as current forecast by calling SET_CURRENT_FORECAST action.
 * @param {*} geometry
 */
function* getAccuWeatherSaga(geometry) {
  try {
    const locationId = yield call(
      getLocationIdByGeoposition,
      geometry.lat,
      geometry.lng
    );
    const language = yield select(getLanguage);
    const accuForecast = yield call(
      getForecastByLocationKey,
      locationId.Key,
      language
    );
    const { DailyForecasts } = accuForecast;
    const savedAt = new Date().getTime();
    const forecast = { DailyForecasts, savedAt, geometry, language };
    yield put({
      type: SET_CURRENT_FORECAST,
      payload: { forecast, geometry }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get forecast for`, geometry);
  } finally {
    yield put({ type: SET_LOADER, payload: { showLoader: false } });
  }
}

/**
 * Wait for SET_CURRENT_FORECAST action. Set forecast after some formatting
 * by calling SET_FORECAST action.
 */
function* setCurrentForecastSaga() {
  while (true) {
    const {
      payload: { forecast, geometry }
    } = yield take(SET_CURRENT_FORECAST);
    if (forecast && forecast.DailyForecasts) {
      yield put({
        type: SET_FORECAST,
        payload: {
          details: forecast
        }
      });
    } else if (forecast && forecast.properties) {
      const { generatedAt, periods } = forecast.properties;
      const savedAt = new Date().getTime();
      yield put({
        type: SET_FORECAST,
        payload: {
          details: {
            properties: { periods },
            savedAt,
            generatedAt,
            geometry
          }
        }
      });
    }
  }
}

/**
 * Return that the given day is today's date or not.
 * @param {*} date
 */
function* todaySaga(date) {
  const now = new Date().getTime();
  return yield call(datesAreOnSameDay, now, date);
}

/**
 * Wait for CLEAR_FORECASTS action. Get forecasts, check each one if it's older than 2 days.
 * Delete these forecasts by calling DELETE_FORECASTS_BY_KEY action.
 */
function* clearForecastsSaga() {
  yield take(CLEAR_FORECASTS);
  const forecasts = yield select(getForecasts);
  const keys = Object.keys(forecasts);
  if (keys.length > 1) {
    const deletableKeys = [];
    for (let i = 0; i < keys.length; i++) {
      const { savedAt } = forecasts[keys[i]];
      const tooOld = yield call(dateOlderThanGivenDays, savedAt, 2);
      if (tooOld) {
        deletableKeys.push(keys[i]);
      }
    }
    if (deletableKeys.length > 0) {
      yield put({
        type: DELETE_FORECASTS_BY_KEY,
        payload: {
          details: deletableKeys
        }
      });
    }
  }
}

/**
 * Wait for SET_CURRENT_LOCATION action. Get current conditions from store.
 * If available and geometry matches and data not older than 2 hours load it from store.
 * Else call API to get it.
 */
function* setCurrentConditionsSaga() {
  while (true) {
    const {
      payload: { location }
    } = yield take(SET_CURRENT_LOCATION);
    yield put({ type: SET_LOADER, payload: { showLoader: true } });
    const { geometry } = location;

    const currConditions = yield select(getCurrentConditions);
    if (currConditions) {
      if (
        geometry.lat === currConditions.geometry.lat &&
        geometry.lng === currConditions.geometry.lng
      ) {
        const tooOld = yield call(
          dateOlderThanGivenHours,
          currConditions.savedAt,
          2
        );
        if (tooOld) {
          yield call(getCurrentConditionsSaga, geometry);
          console.log(
            `[S] loaded current conditions is too old (${new Date(
              currConditions.savedAt
            )}), refreshing it automatically`
          );
        } else {
          yield put({ type: SET_LOADER, payload: { showLoader: false } });
          console.log(
            "[S] previous current condition is available, loading it from store"
          );
        }
      } else {
        yield call(getCurrentConditionsSaga, geometry);
        console.log(
          "[S] previous current condition location doesn't match current location, refreshing it automatically"
        );
      }
    } else {
      yield call(getCurrentConditionsSaga, geometry);
      console.log("[S] getting current conditions from api by geometry");
    }
  }
}

/**
 * Wait for REFRESH_CURRENT_CONDITION.
 * Force refresh current conditions and hour to hour forecast by calling API.
 */
function* refreshCurrentConditionsSaga() {
  let ccNotAvailable = false;
  let hthNotAvailable = false;

  while (true) {
    yield take(REFRESH_CURRENT_CONDITION);
    yield put({ type: SET_LOADER, payload: { showLoader: true } });
    const currConditions = yield select(getCurrentConditions);
    if (currConditions) {
      const { locationKey, geometry } = currConditions;
      yield call(getCurrentConditionsSaga, geometry, locationKey);
      console.log("[S] refreshing current conditions from api by locationKey");
    } else {
      ccNotAvailable = true;
      console.log("[S] no current conditions available, cannot refresh it");
    }

    const hourByHourForecast = yield select(getHourByHourForecast);
    if (hourByHourForecast) {
      const { locationKey, geometry } = hourByHourForecast;
      yield call(getHourByHourForecastSaga, geometry, locationKey);
      console.log(
        "[S] refreshing hour to hour forecast from api by locationKey"
      );
    } else {
      hthNotAvailable = true;
      console.log("[S] no hour to hour forecast available, cannot refresh it");
    }

    if (ccNotAvailable && hthNotAvailable) {
      yield put({ type: SET_LOADER, payload: { showLoader: false } });
    }
  }
}

/**
 * Get locationId from geometry by calling API. From locationId get current conditions
 * by calling API. Call SET_CURRENT_CONDITION action to save it to store.
 * @param {*} geometry
 * @param {*} locKey
 */
function* getCurrentConditionsSaga(geometry, locKey) {
  try {
    let locationKey;
    if (locKey) {
      locationKey = locKey;
    } else {
      const locationId = yield call(
        getLocationIdByGeoposition,
        geometry.lat,
        geometry.lng
      );
      locationKey = locationId.Key;
    }
    const language = yield select(getLanguage);
    const currConditions = yield call(
      getCurrentConditionsByLocationKey,
      locationKey,
      language,
      true
    );
    const savedAt = new Date().getTime();
    const currentConditions = {
      ...currConditions[0],
      savedAt,
      geometry,
      locationKey: locationKey
    };
    yield put({
      type: SET_CURRENT_CONDITION,
      payload: { currentConditions }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get current condiions for`, geometry);
  } finally {
    yield put({ type: SET_LOADER, payload: { showLoader: false } });
  }
}

/**
 * Wait for SET_CURRENT_LOCATION action. Get hour to hour forecast from store.
 * If available and geometry matches and data not older than 1 hours load it from store.
 * Else call API to get it.
 */
function* setHourByHourSaga() {
  while (true) {
    const {
      payload: { location }
    } = yield take(SET_CURRENT_LOCATION);
    yield put({ type: SET_LOADER, payload: { showLoader: true } });
    const { geometry } = location;

    const hbhForecast = yield select(getHourByHourForecast);
    if (hbhForecast) {
      if (
        geometry.lat === hbhForecast.geometry.lat &&
        geometry.lng === hbhForecast.geometry.lng
      ) {
        const tooOld = yield call(
          dateOlderThanGivenHours,
          hbhForecast.savedAt,
          2
        );
        if (tooOld) {
          yield call(getHourByHourForecastSaga, geometry);
          console.log(
            `[S] loaded hour to hour forecast is too old (${new Date(
              hbhForecast.savedAt
            )}), refreshing it automatically`
          );
        } else {
          yield put({ type: SET_LOADER, payload: { showLoader: false } });
          console.log(
            "[S] previous hour to hour forecast is available, loading it from store"
          );
        }
      } else {
        yield call(getHourByHourForecastSaga, geometry);
        console.log(
          "[S] previous hour to hour forecast location doesn't match current location, refreshing it automatically"
        );
      }
    } else {
      yield call(getHourByHourForecastSaga, geometry);
      console.log("[S] getting hour to hour forecast from api by geometry");
    }
  }
}

/**
 * Get locationId from geometry by calling API. From locationId get hour to hour forecast
 * by calling API. Call SET_HOUR_BY_HOUR_FORECAST action to save it to store.
 * @param {*} geometry
 * @param {*} locKey
 */
function* getHourByHourForecastSaga(geometry, locKey) {
  try {
    let locationKey;
    if (locKey) {
      locationKey = locKey;
    } else {
      const locationId = yield call(
        getLocationIdByGeoposition,
        geometry.lat,
        geometry.lng
      );
      locationKey = locationId.Key;
    }
    const response = yield call(get12HourForecastByLocationKey, locationKey);
    const savedAt = new Date().getTime();
    const hourByHourForecast = {
      forecast: response,
      savedAt,
      geometry,
      locationKey: locationKey
    };
    yield put({
      type: SET_HOUR_BY_HOUR_FORECAST,
      payload: { hourByHourForecast }
    });
  } catch (error) {
    // TODO: error handling
    console.error(`couldn't get hour to hour forecast for`, geometry);
  } finally {
    yield put({ type: SET_LOADER, payload: { showLoader: false } });
  }
}

export default function* forecastSaga() {
  yield fork(loadForecastSaga);
  yield fork(locationClickedSaga);
  yield fork(getWeatherByGeometrySaga);
  yield fork(setCurrentForecastSaga);
  yield fork(clearForecastsSaga);
  yield fork(setCurrentConditionsSaga);
  yield fork(refreshCurrentConditionsSaga);
  yield fork(setHourByHourSaga);
}
