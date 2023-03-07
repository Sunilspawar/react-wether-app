import { LocationSearchResult } from "../interfaces/location";

import "./LocationResultItem.scss";

export default function LocationResultItem({
  location,
  onLocationClicked
}: {
  location: LocationSearchResult;
  onLocationClicked: any;
}) {
  const onLocationItemClicked = () => {
    const { geometry, formatted, annotations, components } = location;
    onLocationClicked({ geometry, formatted, annotations, components });
  };

  return (
    <div className="location-item" onClick={() => onLocationItemClicked()}>
      <span>
        {location.formatted} {location.annotations.flag}
      </span>
    </div>
  );
}
