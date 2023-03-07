import React from "react";
import { Sun as SunIcon } from "react-feather";
import RiseSet from "./RiseSet";

export default function SunDetails({
  hoursOfSun,
  sunRise,
  sunSet
}: {
  hoursOfSun: number;
  sunRise: string;
  sunSet: string;
}) {
  return (
    <div className="details-container">
      <div className="icon">
        <SunIcon size={32} />
        <div>{hoursOfSun}h</div>
      </div>
      <div className="content">
        <RiseSet rise={sunRise} set={sunSet}>
          <SunIcon size={18} />
        </RiseSet>
      </div>
    </div>
  );
}
