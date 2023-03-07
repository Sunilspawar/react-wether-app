import React, { useState, useEffect } from "react";
import { TFunction } from "i18next";
import {
  Thermometer as ThermometerIcon,
  ArrowDown as ArrowDownIcon,
  ArrowUp as ArrowUpIcon
} from "react-feather";
import { withTranslation } from "react-i18next";
import {
  AccuForecastTemperature,
  AccuForecastDegreeDaySummary,
  AccuForecastUnit
} from "../interfaces/accu-forecast";
import store from "../redux/store";
import { fahrenheitToCelsius, celsiusToFahrenheit } from "../utils/converters";

function TemperatureDetails({
  temperature,
  realFeelTemperature,
  degreeDaySummary,
  t
}: {
  temperature: AccuForecastTemperature;
  realFeelTemperature: AccuForecastTemperature;
  degreeDaySummary: AccuForecastDegreeDaySummary;
  t: TFunction;
}) {
  const [tempUnit, setTempUnit] = useState("c");

  const setUnitType = () => {
    const { units } = store.getState();
    if (units.temperature !== tempUnit) {
      setTempUnit(units.temperature);
    }
  };

  useEffect(() => {
    setUnitType();

    const unsubscribe = store.subscribe(() => {
      setUnitType();
    });

    return unsubscribe;
  }, []);

  const getTemperature = (temp: AccuForecastUnit) => {
    switch (temp.Unit) {
      case "F":
        if (tempUnit === "c") {
          return Math.abs(fahrenheitToCelsius(temp.Value)).toFixed(2);
        } else {
          return Math.abs(temp.Value);
        }
      case "C":
        if (tempUnit === "c") {
          return Math.abs(temp.Value);
        } else {
          return Math.abs(celsiusToFahrenheit(temp.Value)).toFixed(2);
        }
      default:
        return Math.abs(temp.Value);
    }
  };

  const getTemperatureUnit = () => {
    return tempUnit === "c" ? "°C" : "F";
  };

  const getDegreeSummary = () => {
    const isHeating = !!degreeDaySummary.Heating.Value;

    if (isHeating) {
      return (
        <span className="line-with-icon">
          {getTemperature(degreeDaySummary.Heating)} {getTemperatureUnit()}{" "}
          <ArrowUpIcon size={14} />
        </span>
      );
    } else {
      return (
        <span className="line-with-icon">
          {getTemperature(degreeDaySummary.Cooling)} {getTemperatureUnit()}{" "}
          <ArrowDownIcon size={14} />
        </span>
      );
    }
  };

  return (
    <div className="details-container">
      <div className="icon">
        <ThermometerIcon size={32} />
      </div>
      <div className="content">
        <div>
          {getTemperature(temperature.Minimum)} /{" "}
          {getTemperature(temperature.Maximum)} {getTemperatureUnit()}
        </div>
        <div>
          {t<string>("weather-details.real-feel")}{" "}
          {getTemperature(realFeelTemperature.Minimum)} /{" "}
          {getTemperature(realFeelTemperature.Maximum)} {getTemperatureUnit()}
        </div>
        <div>{getDegreeSummary()}</div>
      </div>
    </div>
  );
}

export default withTranslation("common")(TemperatureDetails);
