import React, { useState } from "react";
import { getWeatherIcon } from "../services/AccuWeatherService";
import { fahrenheitToCelsius, celsiusToFahrenheit } from "../utils/converters";
import store from "../redux/store";
import { TFunction, withTranslation } from "react-i18next";
import ThermometerPercentage from "../thermometer-percentage/ThermometerPercentage";
import { AccuHourByHourForecast } from "../interfaces/accu-forecast";

function HourByHourCard({
  hourForecast,
  minTemp,
  maxTemp,
  t
}: {
  hourForecast: AccuHourByHourForecast;
  minTemp: number;
  maxTemp: number;
  t: TFunction;
}) {
  const [temperature, setTemperature] = useState("c");
  store.subscribe(() => {
    const { units } = store.getState();

    if (units.temperature !== temperature) {
      setTemperature(units.temperature);
    }
  });

  const getHour = () => {
    const date = new Date(hourForecast.DateTime);
    const now = new Date();
    const isSameHour = now.getHours() === date.getHours();
    const hour = date.getHours().toString().padStart(2, "0");

    return isSameHour ? t("current-conditions.now") : `${hour}:00`;
  };

  const getTemperature = () => {
    const {
      Temperature: { Value, Unit }
    } = hourForecast;

    switch (Unit) {
      case "F":
        if (temperature === "c") {
          return <span>{fahrenheitToCelsius(Value).toFixed(0)} &#176;C</span>;
        } else {
          return <span>{Value} F</span>;
        }
      case "C":
        if (temperature === "c") {
          return <span>{Value} &#176;C</span>;
        } else {
          return <span>{celsiusToFahrenheit(Value).toFixed(2)} F</span>;
        }
      default:
        return (
          <span>
            {Value} {Unit}
          </span>
        );
    }
  };

  const getPrecipitation = (showProbability = false, showIntensity = false) => {
    const {
      HasPrecipitation,
      PrecipitationProbability,
      PrecipitationIntensity,
      PrecipitationType
    } = hourForecast;

    if (HasPrecipitation) {
      return (
        <span>
          {showProbability ? PrecipitationProbability + "%" : ""}{" "}
          {showIntensity ? PrecipitationIntensity : ""} {PrecipitationType}
        </span>
      );
    } else {
      return "";
    }
  };

  const getPercentage = () => {
    const offset = Math.abs(maxTemp) - Math.abs(minTemp);
    let val = hourForecast.Temperature.Value;
    let min = minTemp - offset;
    let max = maxTemp + offset;

    if (min < 0) {
      const diff = Math.abs(min);
      min += diff;
      max += diff;
      val += diff;
    }

    return Math.round(((val - min) * 100) / (max - min));
  };

  return (
    <div className="hour-card-wrapper">
      <div className="hour">{getHour()}</div>
      <img
        src={getWeatherIcon(hourForecast.WeatherIcon, true)}
        alt={hourForecast.IconPhrase}
      />
      <div className="temp">
        <ThermometerPercentage
          id={hourForecast.DateTime}
          percentage={getPercentage()}
          startColor="gray"
        />
        {getTemperature()}
      </div>
      <div className="prec">{getPrecipitation()}</div>
    </div>
  );
}

export default withTranslation("common")(HourByHourCard);
