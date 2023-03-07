import { AccuForecastDayNightTransformed } from "../../interfaces/accu-forecast";
import { AppActionEnum } from "./app-actions";

export type AppLocalState = {
  showDetails: boolean;
  details: AccuForecastDayNightTransformed;
  isDayDetails: boolean;
};

type DetailsClickedPayload = {
  forecast: AccuForecastDayNightTransformed;
  isDay: boolean;
};

export type AppLocalAction =
  | { type: AppActionEnum.SHOW_DETAILS; payload: boolean }
  | { type: AppActionEnum.SET_IS_DAY_DETAILS; payload: boolean }
  | {
      type: AppActionEnum.DETAILS_CLICKED;
      payload: DetailsClickedPayload;
    };

export const initialState: AppLocalState = {
  showDetails: false,
  details: null,
  isDayDetails: false
};

export const reducer = (
  state: AppLocalState,
  action: AppLocalAction
): AppLocalState => {
  const { type, payload } = action;

  switch (type) {
    case AppActionEnum.SHOW_DETAILS:
      const showDetails = payload as boolean;
      return {
        ...state,
        showDetails
      };
    case AppActionEnum.SET_IS_DAY_DETAILS:
      const isDayDetails = payload as boolean;
      return {
        ...state,
        isDayDetails
      };
    case AppActionEnum.DETAILS_CLICKED:
      const dcPayload = payload as DetailsClickedPayload;
      return {
        ...state,
        details: dcPayload.forecast,
        isDayDetails: dcPayload.isDay,
        showDetails: true
      };
    default:
      return state;
  }
};
