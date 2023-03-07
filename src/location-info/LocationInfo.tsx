import * as React from "react";
import { useState } from "react";
import { XCircle as XCircleIcon } from "react-feather";
import MapDetails from "./MapDetails";
import CurrencyDetails from "./CurrencyDetails";
import CoordinatesDetails from "./CoordinatesDetails";
import LocationDetails from "./LocationDetails";
import TimezoneDetails from "./TimezoneDetails";
import CallDetails from "./CallDetails";
import RoadDetails from "./RoadDetails";
import { withTranslation } from "react-i18next";
import { useHandleClickOutside } from "../utils/useHandleClickOutside";

import "./LocationInfo.scss";
import { TFunction } from "i18next";
import { ForecastLocation } from "../interfaces/location";

function LocationInfo({
  location,
  isPinned,
  onPinClicked,
  t
}: {
  location: ForecastLocation;
  isPinned: boolean;
  onPinClicked: any;
  t: TFunction;
}) {
  const [showInfo, setShowInfo] = useState(false);

  const wrapperEl = useHandleClickOutside(() => {
    setShowInfo(false);
  }, showInfo);

  const switchShowInfo = (event: any) => {
    event.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <div className="location-name" onClick={() => setShowInfo(true)}>
      {location.name}
      {showInfo && (
        <div className="info-card" ref={wrapperEl}>
          <div className="name-wrapper">
            <span className="name">
              {location.name} {location.flag}
            </span>
            <button onClick={switchShowInfo}>
              <XCircleIcon size={22} color="#656565" />
            </button>
          </div>
          <button className="pin-button" onClick={() => onPinClicked()}>
            {isPinned
              ? t<string>("location-info.unpin")
              : t<string>("location-info.pin")}
          </button>
          <MapDetails osm={location.osm} />
          <CoordinatesDetails dms={location.dms} />
          <LocationDetails components={location.components} />
          <TimezoneDetails timezone={location.timezone} />
          <CurrencyDetails currency={location.currency} />
          <CallDetails callingcode={location.callingcode} />
          <RoadDetails roadinfo={location.roadinfo} />
        </div>
      )}
    </div>
  );
}

export default withTranslation("common")(LocationInfo);
