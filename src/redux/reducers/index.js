import { combineReducers } from "redux";
import units from "./units";
import forecast from "./forecast";
import locations from "./locations";
import loader from "./loader";

export default combineReducers({ units, forecast, locations, loader });
