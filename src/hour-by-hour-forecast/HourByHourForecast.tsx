import { TFunction, withTranslation } from "react-i18next";
import { AccuHourByHourForecast } from "../interfaces/accu-forecast";
import HourByHourCard from "./HourByHourCard";

import "./HourByHourForecast.scss";

function HourByHourForecast({
  hourByHourForecast,
  t
}: {
  hourByHourForecast: AccuHourByHourForecast[];
  t: TFunction;
}) {
  let maxTemp = 0;
  let minTemp = 0;
  if (hourByHourForecast && hourByHourForecast.length) {
    maxTemp = hourByHourForecast[0].Temperature.Value;
    minTemp = hourByHourForecast[0].Temperature.Value;

    hourByHourForecast.forEach((forecast) => {
      if (forecast.Temperature.Value > maxTemp) {
        maxTemp = forecast.Temperature.Value;
      }
      if (forecast.Temperature.Value < minTemp) {
        minTemp = forecast.Temperature.Value;
      }
    });
  }

  return (
    <div className="hour-forecast">
      <h1>{t("current-conditions.h12forecast")}</h1>
      <div className="hour-card-container">
        {hourByHourForecast.map((forecast) => (
          <HourByHourCard
            key={forecast.DateTime}
            hourForecast={forecast}
            minTemp={minTemp}
            maxTemp={maxTemp}
          />
        ))}
      </div>
    </div>
  );
}

export default withTranslation("common")(HourByHourForecast);
