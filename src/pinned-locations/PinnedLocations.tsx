import React, { useEffect, useState } from "react";
import { XCircle as XCircleIcon, MapPin as MapPinIcon } from "react-feather";
import { useTranslation } from "react-i18next";
import {
  ForecastLocation,
  PinnedForecastLocations
} from "../interfaces/location";

import "./PinnedLocations.scss";

export default function PinnedLocations({
  pinnedLocations,
  removePinnedLocation,
  loadLocation
}: {
  pinnedLocations: PinnedForecastLocations;
  removePinnedLocation: any;
  loadLocation: any;
}) {
  const [locations, setLocations] = useState([] as ForecastLocation[]);
  const { t } = useTranslation("common");

  useEffect(() => {
    const locations: ForecastLocation[] = [];
    const keys = Object.keys(pinnedLocations);
    for (let i = 0; i < keys.length; i++) {
      locations.push(pinnedLocations[keys[i]]);
      setLocations(locations);
    }
  }, []);

  return (
    <div className="pinned-locations-container">
      {locations && locations.length > 0 && (
        <div className="title">
          <MapPinIcon size={20} />
          {t("pinned-locations.title")}
        </div>
      )}
      {locations.map((location) => (
        <div className="pinned-location-item" key={location.name}>
          <span onClick={() => loadLocation(location)}>{location.name}</span>
          <button onClick={() => removePinnedLocation(location.name)}>
            <XCircleIcon size={18} color="#545454" />
          </button>
        </div>
      ))}
    </div>
  );
}
