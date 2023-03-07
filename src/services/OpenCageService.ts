import axios from "axios";

const BASE_URL = "https://api.opencagedata.com/geocode/v1/";

// https://opencagedata.com/api

export function getLocattionByCityName(city: string) {
  let url = `${BASE_URL}json?q=${city}&key=${process.env.REACT_APP_OPENCAGE_KEY}`;

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}
