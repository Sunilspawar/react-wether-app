import axios from "axios";

const BASE_URL = "https://dataservice.accuweather.com/";
const API_KEY = process.env.REACT_APP_ACCUWEATHER_API_KEY;

const getDays = (days: number) => {
  switch (days) {
    case 1:
    case 5:
    case 10:
    case 15:
      return days;
    default:
      return 5;
  }
};

const getLanguage = (language: string) => {
  switch (language) {
    case "en":
      return "en-us";
    case "hu":
      return "hu-hu";
    default:
      return "en-us";
  }
};

/**
 * https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/cities/geoposition/search
 * @param {*} lat
 * @param {*} lng
 */
export function getLocationIdByGeoposition(lat: number, lng: number) {
  let url = `${BASE_URL}locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat},${lng}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 * https://developer.accuweather.com/accuweather-forecast-api/apis/get/forecasts/v1/daily/5day/%7BlocationKey%7D
 * @param {*} locationKey
 * @param {*} days
 * @param {Boolean} details
 * @param {*} metric
 */
export function getForecastByLocationKey(
  locationKey: number,
  language: string,
  days = 5,
  details = true,
  metric: string
) {
  days = getDays(days);
  language = getLanguage(language);
  let url = `${BASE_URL}forecasts/v1/daily/${days}day/${locationKey}?apikey=${API_KEY}&details=${details}&metric=${metric}&language=${language}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 * https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/%7BlocationKey%7D
 * @param {*} locationKey
 * @param {Boolean} details
 */
export function getCurrentConditionsByLocationKey(
  locationKey: number,
  language: string,
  details = false
) {
  language = getLanguage(language);

  let url = `${BASE_URL}currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=${details}&language=${language}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 * https://developer.accuweather.com/accuweather-forecast-api/apis/get/forecasts/v1/hourly/12hour/%7BlocationKey%7D
 * @param {*} locationKey
 * @param {*} details
 */
export function get12HourForecastByLocationKey(
  locationKey: number,
  details = false
) {
  let url = `${BASE_URL}forecasts/v1/hourly/12hour/${locationKey}?apikey=${API_KEY}&details=${details}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

/**
 *
 * @param {*} iconNumber
 * @param {*} useModerIcons
 */
export function getWeatherIcon(iconNumber: number, useModernIcons: boolean) {
  const iconNum = iconNumber.toString().padStart(2, "0");

  if (useModernIcons) {
    return `https://www.accuweather.com/images/weathericons/${iconNum}.svg`;
  } else {
    return `https://developer.accuweather.com/sites/default/files/${iconNum}-s.png`;
  }
}
