import {
  SET_LOCATION,
  SET_CURRENT_LOCATION,
  ADD_PINNED_LOCATION,
  REMOVE_PINNED_LOCATION
} from '../actionTypes';

const initialState = {
  currentLocation: null,
  locations: {},
  pinnedLocations: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LOCATION: {
      const key = action.payload.details.term;
      if (!state.locations[key]) {
        const newState = { ...state };
        newState.locations[key] = action.payload.details.results;

        return newState;
      }
      return state;
    }
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload.location
      };
    case ADD_PINNED_LOCATION: {
      const location = action.payload.location;
      const { name } = location;
      if (!state.pinnedLocations[name]) {
        const newState = { ...state };
        newState.pinnedLocations[name] = location;
        return newState;
      }
      return state;
    }
    case REMOVE_PINNED_LOCATION: {
      const name = action.payload.name;
      if (state.pinnedLocations[name]) {
        const newState = { ...state };
        const newPinnedLocations = { ...newState.pinnedLocations };
        delete newPinnedLocations[name];
        newState.pinnedLocations = newPinnedLocations;
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
}
