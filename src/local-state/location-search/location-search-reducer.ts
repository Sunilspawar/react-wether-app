import { LocationSearchActionEnum as ActionEnum } from "./location-search-actions";

import { LocationSearchResult } from "../../interfaces/location";

export type LocationSearchState = {
  searchTerm: string;
  results?: LocationSearchResult[];
  showResults: boolean;
};

export type LocationSearchAction =
  | { type: ActionEnum.SET_SEARCH_TERM; payload: string }
  | { type: ActionEnum.SHOW_RESULTS; payload: boolean }
  | { type: ActionEnum.SET_RESULTS; payload: LocationSearchResult[] };

export const initialState: LocationSearchState = {
  searchTerm: "",
  results: [],
  showResults: false
};

export const reducer = (
  state: LocationSearchState,
  action: LocationSearchAction
): LocationSearchState => {
  const { type, payload } = action;

  switch (type) {
    case ActionEnum.SET_SEARCH_TERM:
      const searchTerm = payload as string;
      return {
        ...state,
        searchTerm
      };
    case ActionEnum.SET_RESULTS:
      const results = payload as Array<LocationSearchResult>;
      return {
        ...state,
        results,
        showResults: true
      };
    case ActionEnum.SHOW_RESULTS:
      const showResults = payload as boolean;
      return {
        ...state,
        showResults
      };
    default:
      return state;
  }
};
