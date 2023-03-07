import { SET_LOADER } from "../actionTypes";

const initialState = {
  showLoader: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADER:
      return { ...state, showLoader: action.payload.showLoader };
    default:
      return state;
  }
}
