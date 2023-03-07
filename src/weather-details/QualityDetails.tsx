import React from "react";
import {
  BarChart2 as BarChart2Icon,
  AlertCircle as AlertCircleIcon
} from "react-feather";
import { AccuForecastAirAndPollen } from "../interfaces/accu-forecast";

export default function QualityDetails({
  airAndPollen
}: {
  airAndPollen: AccuForecastAirAndPollen[];
}) {
  const getAirAndPollen = (aap: AccuForecastAirAndPollen) => {
    const unit =
      aap.Name !== "AirQuality" && aap.Name !== "UVIndex" ? " p/㎥" : "";
    return `${aap.Name}: ${aap.Category} (${aap.Value}${unit})`;
  };

  const getCategoryIcon = (value: number) => {
    let color = value > 5 ? "red" : "orange";
    if (value > 4) {
      return <AlertCircleIcon size={16} color={color} />;
    } else {
      return "";
    }
  };

  return (
    <div className="details-container">
      <div className="icon">
        <BarChart2Icon size={32} />
      </div>
      <div className="content">
        {airAndPollen.map((aap) => (
          <div className="line-with-icon" key={aap.Name}>
            {getAirAndPollen(aap)}
            {getCategoryIcon(aap.CategoryValue)}
          </div>
        ))}
      </div>
    </div>
  );
}
