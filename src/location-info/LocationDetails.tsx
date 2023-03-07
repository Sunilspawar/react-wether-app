import * as React from "react";
import { Map as MapIcon } from "react-feather";
import { LocationComponents } from "../interfaces/location";

export default function LocationDetails({
  components
}: {
  components: LocationComponents;
}) {
  const getLocationString = () => {
    const str = `${components.continent}, ${components.country}(${components.country_code})`;
    const region = components.region ? ` - ${components.region}` : "";

    return `${str}${region}`;
  };

  return (
    <div className="info-block">
      <MapIcon size={24} />
      <div className="values">{getLocationString()}</div>
    </div>
  );
}
