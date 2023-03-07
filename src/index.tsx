import React, { useEffect, useReducer, useState } from "react";
import { createRoot } from "react-dom/client";
import ForecastList from "./forecast-list/ForecastList";
import UnitChanger from "./unit-changer/UnitChanger";
import LocationInfo from "./location-info/LocationInfo";
import Modal from "./modal/Modal";
import WeatherDetails from "./weather-details/WeatherDetails";
import { saveState } from "./utils/localStorage";
import { takeOverConsole } from "./utils/consoleCapturer";
import { Provider } from "react-redux";
import store from "./redux/store";
import { connect } from "react-redux";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18next from "i18next";
import { AppActionEnum } from "./local-state/app/app-actions";
import { reducer, initialState } from "./local-state/app/app-reducer";
import LogDisplay from "./log-display/LogDisplay";

import { isParamWithValueAvailable } from "./utils/query-param-extractor";
import LocationChanger from "./location-changer/LocationChanger";
// import CurrentConditions from "./current-conditions/CurrentConditions";
import { Loader as LoaderIcon } from "react-feather";
import Loader from "./loader/Loader";
import { useDidUpdateEffect } from "./utils/useDidUpdateEffect";

import common_en from "./translations/en/common.json";
import common_hu from "./translations/hu/common.json";

import "./styles.scss";
import { AccuForecastDayNightTransformed } from "./interfaces/accu-forecast";
import { LocationSearchResult } from "./interfaces/location";

function App(props: any) {
  // console.log(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showDetails, details, isDayDetails } = state;
  const [isSelectedLocationPinned, setIsSelectedLocationPinned] = useState(
    false
  );
  const [consoleArgs, setConsoleArgs] = useState(null);
  const [consoleMessageType, setConsoleMessageType] = useState(null);
  
  const [showConsole, setShowConsole] = useState(false);
  const { t, i18n } = useTranslation("common");

  const {
    forecast: {
      currentForecast: forecast,
      // currentConditions,
      // hourByHourForecast
    },
    locations: { currentLocation: location, pinnedLocations },
    useAccuWeatherApi,
    language
  } = props;

  // let hbhForecast = [];
  // if (hourByHourForecast && hourByHourForecast.forecast) {
  //   hbhForecast = hourByHourForecast.forecast;
  // }

  const consoleCallback = (method: any, args: any) => {
    setConsoleMessageType(method);
    setConsoleArgs(args);
  };

  const showLeaveAlert = (e: any) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave the page?";
  };

  useEffect(() => {
    
    if (isParamWithValueAvailable("showLog", "1")) {
      takeOverConsole(consoleCallback);
      setShowConsole(true);
    }
    props.dispatch({ type: "LOAD_FORECAST" });
    props.dispatch({ type: "CLEAR_FORECASTS" });

    window.addEventListener("beforeunload", showLeaveAlert);
    return () => {
      window.removeEventListener("beforeunload", showLeaveAlert);
    };
  }, []);

  useEffect(() => {
    const keys = pinnedLocations ? Object.keys(pinnedLocations) : [];
    let isPinned = false;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === location.name) {
        isPinned = true;
        break;
      }
    }
    setIsSelectedLocationPinned(isPinned);
  }, [props.locations]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // refresh weather if language changes, skip first time
  useDidUpdateEffect(() => {
    props.dispatch({
      type: "GET_WEATHER_BY_GEOMETRY",
      payload: forecast.geometry
    });
    props.dispatch({
      type: "REFRESH_CURRENT_CONDITION"
    });
  }, [language]);

  store.subscribe(() => {
    saveState({
      ...store.getState()
    });
  });

  const onLocationClicked = (details: Partial<LocationSearchResult>) => {
    if (
      details.geometry &&
      location.geometry.lat === details.geometry.lat &&
      location.geometry.lng === details.geometry.lng
    ) {
      console.log("Same location clicked, no need to load it");
    } else {
      props.dispatch({ type: "LOCATION_CLICKED", payload: details });
    }
  };

  const onApiChanged = (e: any) => {
    if (e.target.value === "accuweather") {
      props.dispatch({ type: "USE_ACCUWEATHER", payload: true });
    } else {
      props.dispatch({ type: "USE_ACCUWEATHER", payload: false });
    }
  };

  const dispatchLocalAction = (type: AppActionEnum, payload: any) => {
    dispatch({
      type,
      payload
    });
  };

  const onDetailsClicked = (
    forecast: AccuForecastDayNightTransformed,
    isDay: boolean
  ) => {
    dispatchLocalAction(AppActionEnum.DETAILS_CLICKED, { forecast, isDay });
  };

  const onRefreshWeatherClicked = () => {
    props.dispatch({
      type: "GET_WEATHER_BY_GEOMETRY",
      payload: forecast.geometry
    });
  };

  // const onRefreshCurrentConditionsClicked = () => {
  //   props.dispatch({
  //     type: "REFRESH_CURRENT_CONDITION"
  //   });
  // };

  const removePinnedLocation = (name: string) => {
    props.dispatch({
      type: "REMOVE_PINNED_LOCATION",
      payload: { name }
    });
  };

  const onPinClicked = () => {
    if (!isSelectedLocationPinned) {
      props.dispatch({
        type: "ADD_PINNED_LOCATION",
        payload: { location }
      });
    } else {
      removePinnedLocation(location.name);
    }
  };

  const loadLocation = (location: Partial<LocationSearchResult>) => {
    onLocationClicked(location);
  };

  return (
    <div className={showDetails ? "App disable-scroll" : "App"}>
      <Modal
        show={showDetails}
        onClose={() => dispatchLocalAction(AppActionEnum.SHOW_DETAILS, false)}
      >
        <WeatherDetails details={details} isDay={isDayDetails} />
      </Modal>
      <div className="location-changer-container">
        <LocationChanger
          forecast={forecast}
          location={location}
          useAccuWeatherApi={useAccuWeatherApi}
          onLocationClicked={onLocationClicked}
          onApiChanged={onApiChanged}
          onRefreshWeatherClicked={onRefreshWeatherClicked}
          pinnedLocations={pinnedLocations}
          removePinnedLocation={removePinnedLocation}
          loadLocation={loadLocation}
        />
        {/* <CurrentConditions
          currentConditions={currentConditions}
          hourByHourForecast={hbhForecast}
          onRefreshCurrentConditionsClicked={onRefreshCurrentConditionsClicked}
        /> */}
      </div>
      {(!forecast || (!forecast.properties && !forecast.DailyForecasts)) && (
        <div
          className={!forecast || !location ? "info-text animate" : "info-text"}
        >
          <LoaderIcon size={18} />
          {!location
            ? t("general.searching-location")
            : t("general.weather-error")}
        </div>
      )}
      <div className="weather-container">
        <div className="unit-changer-container">
          {location && (
            <LocationInfo
              location={location}
              isPinned={isSelectedLocationPinned}
              onPinClicked={onPinClicked}
            />
          )}
          {forecast && (forecast.properties || forecast.DailyForecasts) && (
            <UnitChanger />
          )}
        </div>
        {forecast && forecast.properties && (
          <ForecastList periods={forecast.properties.periods} />
        )}
        {forecast && forecast.DailyForecasts && (
          <ForecastList
            periods={forecast.DailyForecasts}
            onDetailsClicked={onDetailsClicked}
          />
        )}
        <div className="app-version"></div>
        <a
          // href="https://www.accuweather.com/"
          rel="noreferrer"
          target="_blank"
          className="accu-link"
        >
          {" "}
        </a>
      </div>
      {showConsole && (
        <LogDisplay args={consoleArgs} type={consoleMessageType} />
      )}
      <Loader />
    </div>
  );
}

function mapStateToProps(state: any) {
  const {
    forecast,
    locations,
    units: { useAccuWeatherApi, language }
  } = state;
  return {
    forecast,
    locations,
    useAccuWeatherApi,
    language
  };
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: { common: common_en },
    hu: { common: common_hu }
  }
});

const ConnectedApp = connect(mapStateToProps, null)(App);

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <ConnectedApp />
    </I18nextProvider>
  </Provider>
);
