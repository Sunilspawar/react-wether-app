import React from "react";
import { getDayOfWeekFromEpoch } from "../utils/date";
import TemperatureDetails from "./TemperatureDetails";
import WindDetails from "./WindDetails";
import PrecipitationDetails from "./PrecipitationDetails";
import SunDetails from "./SunDetails";
import MoonDetails from "./MoonDetails";
import QualityDetails from "./QualityDetails";
import DescriptionDetails from "./DescriptionDetails";

import "./WeatherDetails.scss";
import { useTranslation } from "react-i18next";
import { AccuForecastDayNightTransformed } from "../interfaces/accu-forecast";

export default function WeatherDetails({
  details,
  isDay
}: {
  details: AccuForecastDayNightTransformed;
  isDay: boolean;
}) {
  const { t } = useTranslation("common");
  //console.table(details);

  const getDayOfWeek = (date: number) => {
    const day = getDayOfWeekFromEpoch(date);
    const key = `general.${day}`;

    return t(key);
  };

  return (
    <div className="details-wrapper">
      <div className="details-name">
        {getDayOfWeek(details.date)} {!isDay ? t("weather-details.night") : ""}
      </div>

      <DescriptionDetails
        icon={details.Icon}
        iconPhrase={details.IconPhrase}
        longPhrase={details.LongPhrase}
        shortPhrase={details.ShortPhrase}
      />

      <div className="grid">
        <TemperatureDetails
          temperature={details.temperature}
          realFeelTemperature={details.details.RealFeelTemperature}
          degreeDaySummary={details.details.DegreeDaySummary}
        />

        <WindDetails wind={details.Wind} windGust={details.WindGust} />

        <PrecipitationDetails details={details} />

        <SunDetails
          hoursOfSun={details.details.HoursOfSun}
          sunRise={details.details.Sun.Rise}
          sunSet={details.details.Sun.Set}
        />

        <MoonDetails
          moonRise={details.details.Moon.Rise}
          moonSet={details.details.Moon.Set}
          moonPhase={details.details.Moon.Phase}
          moonAge={details.details.Moon.Age}
        />

        <QualityDetails airAndPollen={details.details.AirAndPollen} />
      </div>
    </div>
  );
}
