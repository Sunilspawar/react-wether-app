import * as React from "react";
import { MapPin as MapPinIcon } from "react-feather";
import { DMS } from "../interfaces/location";

export default function CoordinatesDetails({ dms }: { dms: DMS }) {
  return (
    <div className="info-block">
      <MapPinIcon size={24} />
      <div className="values">
        <span className="value">{dms.lat}</span>
        <span className="value">{dms.lng}</span>
      </div>
    </div>
  );
}
