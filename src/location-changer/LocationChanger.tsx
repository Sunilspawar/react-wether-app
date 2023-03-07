import * as React from "react";
import { useState } from "react";
import LocationSearch from "../location-search/LocationSearch";
import ApiSelect from "../api-select/ApiSelect";
import {
  XCircle as XCircleIcon,
  Globe as GlobeIcon,
  // Map as MapIcon
} from "react-feather";
import { useTranslation } from "react-i18next";
import { useHandleClickOutside } from "../utils/useHandleClickOutside";
import { AccuForecast } from "../interfaces/accu-forecast";
import {
  ForecastLocation,
  PinnedForecastLocations
} from "../interfaces/location";

import "./LocationChanger.scss";
import PinnedLocations from "../pinned-locations/PinnedLocations";

export default function LocationChanger({
  forecast,
  location,
  useAccuWeatherApi,
  onLocationClicked,
  onApiChanged,
  onRefreshWeatherClicked,
  pinnedLocations,
  removePinnedLocation,
  loadLocation
}: {
  forecast: AccuForecast;
  location: ForecastLocation;
  useAccuWeatherApi: boolean;
  onLocationClicked: any;
  onApiChanged: any;
  onRefreshWeatherClicked: any;
  pinnedLocations: PinnedForecastLocations;
  removePinnedLocation: any;
  loadLocation: any;
}) {
  const [showInputBar, setShowInputBar] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const { t } = useTranslation("common");

  const wrapperEl = useHandleClickOutside(() => {
    setShowInputBar(false);
  }, showInputBar);

  const onSearchTermEmpty = (isEmpty: boolean) => {
    if (isEmpty !== disableButton) {
      setDisableButton(isEmpty);
    }
  };

  const onLoadLocation = (details: any) => {
    loadLocation(details);
    setShowInputBar(false);
  };

  return (
    <>
      <div
        className="location-button"
        onClick={() => setShowInputBar(!showInputBar)}
      >
        {t("location")}
      </div>
      {showInputBar && (
        <div className="location-wrapper" ref={wrapperEl}>
          <span>{t("CITY NAME")}</span>
          <button
            className="close-button"
            onClick={() => setShowInputBar(!showInputBar)}
          >
            <XCircleIcon size={22} color="#656565" />
          </button>
          <div className="input-bar">
            <div className="input-line">
              {/* <GlobeIcon size={20} /> */}
              <ApiSelect
                api={useAccuWeatherApi ? "accuweather" : "openweather"}
                onApiChanged={onApiChanged}
              />
            </div>
            <div className="input-line">
            <GlobeIcon size={20} />
              <LocationSearch
                onLocationClicked={onLocationClicked}
                onSearchTermEmpty={onSearchTermEmpty}
              />
            </div>
            {forecast && location && (
              <button
                className="refresh-button"
                onClick={onRefreshWeatherClicked}
                disabled={disableButton}
              >
                {t("location-changer.refresh")}
              </button>
            )}

            <div className="pinned-wrapper">
              <PinnedLocations
                pinnedLocations={pinnedLocations}
                removePinnedLocation={removePinnedLocation}
                loadLocation={onLoadLocation}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
