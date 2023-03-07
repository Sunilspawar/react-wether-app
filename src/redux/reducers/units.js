import {
  TOGGLE_TEMPERATURE,
  TOGGLE_WINDSPEED,
  TOGGLE_PRECIPITATION,
  TOGGLE_LANGUAGE,
  USE_ACCUWEATHER
} from "../actionTypes";

const initialState = {
  temperature: "c",
  windSpeed: "kmh",
  precipitation: "cm",
  language: "en",
  useAccuWeatherApi: true
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_TEMPERATURE:
      return { ...state, temperature: action.payload.temp };
    case TOGGLE_WINDSPEED:
      return { ...state, windSpeed: action.payload.speed };
    case TOGGLE_PRECIPITATION:
      return { ...state, precipitation: action.payload.precipitation };
    case TOGGLE_LANGUAGE:
      return { ...state, language: action.payload.language };
    case USE_ACCUWEATHER:
      return { ...state, useAccuWeatherApi: action.payload };
    default:
      return state;
  }
}
