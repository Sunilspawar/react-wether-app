import * as React from "react";
import { Clock as ClockIcon } from "react-feather";
import { TimeZone } from "../interfaces/location";

export default function TimezoneDetails({ timezone }: { timezone: TimeZone }) {
  return (
    <div className="info-block">
      <ClockIcon size={24} />
      <div className="values">
        {timezone.name} - {timezone.short_name} ({timezone.offset_string})
      </div>
    </div>
  );
}
