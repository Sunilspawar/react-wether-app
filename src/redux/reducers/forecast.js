import {
  SET_FORECAST,
  SET_CURRENT_FORECAST,
  DELETE_FORECASTS_BY_KEY,
  SET_CURRENT_CONDITION,
  SET_HOUR_BY_HOUR_FORECAST
} from "../actionTypes";
import { datesAreOnSameDay } from "../../utils/date";

const initialState = {
  currentForecast: null,
  currentConditions: null,
  hourByHourForecast: null,
  forecasts: {}
};

const generateKey = (geometry) => {
  return `${geometry.lat},${geometry.lng}`;
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FORECAST:
      const key = generateKey(action.payload.details.geometry);
      if (!state.forecasts[key]) {
        const newState = { ...state };
        newState.forecasts[key] = action.payload.details;
        return newState;
      } else if (
        !datesAreOnSameDay(new Date().getTime(), state.forecasts[key].savedAt)
      ) {
        const newState = { ...state };
        newState.forecasts[key] = action.payload.details;
        return newState;
      } else if (
        action.payload.details.language !== state.forecasts[key].language
      ) {
        const newState = { ...state };
        newState.forecasts[key] = action.payload.details;
        return newState;
      }

      return state;
    case SET_CURRENT_FORECAST:
      return {
        ...state,
        currentForecast: action.payload.forecast
      };
    case SET_CURRENT_CONDITION:
      return {
        ...state,
        currentConditions: action.payload.currentConditions
      };
    case SET_HOUR_BY_HOUR_FORECAST:
      return {
        ...state,
        hourByHourForecast: action.payload.hourByHourForecast
      };
    case DELETE_FORECASTS_BY_KEY:
      const newState = { ...state };
      const newForecasts = { ...newState.forecasts };
      for (let key of action.payload.details) {
        delete newForecasts[key];
      }
      newState.forecasts = newForecasts;
      return newState;
    default:
      return state;
  }
}
