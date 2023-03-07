import axios from "axios";

export function getNearestCities(lat: number, lng: number, range = 0) {
  const url = `https://geocodeapi.p.rapidapi.com/GetNearestCities?latitude=${lat}&longitude=${lng}&range=${range}`;

  return axios
    .get(url, {
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY
      }
    })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}
