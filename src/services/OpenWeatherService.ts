import axios from "axios";

const BASE_URL = "https://api.weather.gov/";

// https://rapidapi.com/theapiguy/api/national-weather-service/details

export function getWeatherByCoordinates(lat: number, lng: number) {
  let url = `${BASE_URL}points/${lat},${lng}/forecast`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}
