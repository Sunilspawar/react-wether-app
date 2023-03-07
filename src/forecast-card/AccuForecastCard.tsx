import * as React from "react";
import { useState } from "react";
import { getDayOfWeekFromEpoch, convertEpochToDate } from "../utils/date";
import { getWeatherIcon } from "../services/AccuWeatherService";
import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  mphToKmh,
  kmhToMph,
  inToCm,
  cmToIn
} from "../utils/converters";
import { isSafari } from "../utils/browsers";
import store from "../redux/store";
import {
  Thermometer as ThermometerIcon,
  CloudRain as CloudRainIcon,
  Wind as WindIcon,
  MoreHorizontal as MoreHorizontalIcon,
  BarChart2 as BarChart2Icon
} from "react-feather";

import "./AccuForecastCard.scss";
import { useTranslation } from "react-i18next";
import {
  AccuForecastDayNightTransformed,
  AccuForecastDirection,
  AccuForecastUnit
} from "../interfaces/accu-forecast";

const USE_MODERN_ICONS = true;

export default function AccuForecastCard({
  forecast,
  isDay,
  onDetailsClicked
}: {
  forecast: AccuForecastDayNightTransformed;
  isDay: boolean;
  onDetailsClicked: any;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [temperature, setTemperature] = useState("c");
  const [windSpeed, setWindSpeed] = useState("kmh");
  const [precipitation, setPrecipitation] = useState("cm");
  const { t } = useTranslation("common");

  const date = new Date(convertEpochToDate(forecast ? forecast.date : 0));

  store.subscribe(() => {
    const { units } = store.getState();

    if (units.temperature !== temperature) {
      setTemperature(units.temperature);
    }
    if (units.windSpeed !== windSpeed) {
      setWindSpeed(units.windSpeed);
    }
    if (units.precipitation !== precipitation) {
      setPrecipitation(units.precipitation);
    }
  });

  const getTemperature = (unit: string, temp: number) => {
    switch (unit) {
      case "F":
        if (temperature === "c") {
          return <span>{fahrenheitToCelsius(temp).toFixed(2)} &#176;C</span>;
        } else {
          return <span>{temp} F</span>;
        }
      case "C":
        if (temperature === "c") {
          return <span>{temp} &#176;C</span>;
        } else {
          return <span>{celsiusToFahrenheit(temp).toFixed(2)} F</span>;
        }
      default:
        return (
          <span>
            {temp} {unit}
          </span>
        );
    }
  };

  const replaceAllWindsInString = (windStr: string) => {
    if (windSpeed === "kmh" && windStr.includes("mi/h")) {
      const winds = windStr.match(/\d+/g);
      if (winds) {
        for (let i = 0; i < winds.length; i++) {
          windStr = windStr.replace(winds[i], i.toString());
        }
        for (let i = 0; i < winds.length; i++) {
          windStr = windStr.replace(
            i.toString(),
            Math.floor(mphToKmh(winds[i])).toString()
          );
        }
        windStr = windStr.replace("mi/h", "km/h");
      } else {
        windStr = "";
      }
    } else if (windSpeed === "mph" && windStr.includes("kmh")) {
      const winds = windStr.match(/\d+/g);
      if (winds) {
        for (let i = 0; i < winds.length; i++) {
          windStr = windStr.replace(winds[i], i.toString());
        }
        for (let i = 0; i < winds.length; i++) {
          windStr = windStr.replace(
            i.toString(),
            Math.floor(kmhToMph(winds[i])).toString()
          );
        }
        windStr = windStr.replace("km/h", "mi/h");
      } else {
        windStr = "";
      }
    }

    return windStr;
  };

  const getWind = (
    speed: AccuForecastUnit,
    direction: AccuForecastDirection
  ) => {
    let speedStr = `${speed.Value} ${speed.Unit}`;
    if (speed.Unit === "mi/h" && windSpeed === "kmh") {
      speedStr = replaceAllWindsInString(speedStr);
    } else if (speed.Unit === "kmh" && windSpeed === "mph") {
      speedStr = replaceAllWindsInString(speedStr);
    }

    return (
      <div className="wind">
        <span>{direction.Localized}</span>
        <span>{speedStr}</span>
      </div>
    );
  };

  const getTotalLiquid = (liquid: AccuForecastUnit, probability: number) => {
    switch (liquid.Unit) {
      case "in":
        if (precipitation === "cm") {
          return (
            <span>
              {inToCm(liquid.Value).toFixed(1)} cm ({probability}%)
            </span>
          );
        } else {
          return (
            <span>
              {liquid.Value} in ({probability}%)
            </span>
          );
        }
      case "cm":
        if (precipitation === "in") {
          return (
            <span>
              {cmToIn(liquid.Value).toFixed(1)} cm ({probability}%)
            </span>
          );
        } else {
          return (
            <span>
              {liquid.Value} in ({probability}%)
            </span>
          );
        }
      default:
        return (
          <span>
            {liquid.Value} {liquid.Unit} ({probability}%)
          </span>
        );
    }
  };

  const setFlippedState = (state: boolean, isClick: boolean) => {
    if (isClick) {
      setIsFlipped(state);
    } else if (!isSafari) {
      setIsFlipped(state);
    }
  };

  const isSameDay = () => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentPartOfDay = () => {
    if (!isSameDay()) {
      return false;
    }
    const hours = new Date().getHours();
    if (
      (hours >= 0 && hours < 6 && !isDay) ||
      (hours >= 6 && hours < 24 && isDay)
    ) {
      return true;
    }

    return false;
  };

  const getDayOfWeek = (date: number) => {
    const day = getDayOfWeekFromEpoch(date);
    const key = `general.${day}`;

    return t(key);
  };

  return (
    <div
      className={isFlipped ? "forecast-container flip" : "forecast-container"}
    >
      <div className={isSafari ? "inner is-safari" : "inner"}>
        <div className={isCurrentPartOfDay() ? "front current" : "front"}>
          <div className="info-container">
            <div className="name">
              {getDayOfWeek(forecast.date)}{" "}
              {isDay ? "" : t("forecast-card.night")}
            </div>
            <div className="date">{date.toLocaleDateString()}</div>
            <div className="icon-short">
              <img
                className={USE_MODERN_ICONS ? "icon accu modern" : "icon accu"}
                src={getWeatherIcon(forecast.Icon, USE_MODERN_ICONS)}
                alt={forecast.IconPhrase}
              />
              <div className="short">{forecast.ShortPhrase}</div>
            </div>
            <div className="temperature card-item">
              <ThermometerIcon size={24} />
              {getTemperature(
                forecast.temperature.Maximum.Unit,
                forecast.temperature.Maximum.Value
              )}
            </div>
            <div className="precipitation card-item">
              <CloudRainIcon size={24} />
              {getTotalLiquid(
                forecast.TotalLiquid,
                forecast.PrecipitationProbability
              )}
            </div>
            <div className="wind-wrapper card-item">
              <WindIcon size={24} />
              {getWind(forecast.Wind.Speed, forecast.Wind.Direction)}
            </div>
          </div>
          <div className="bottom-container">
            <div
              className="round-button more"
              onClick={() => setFlippedState(true, true)}
              onMouseOver={() => setFlippedState(true, false)}
            >
              <MoreHorizontalIcon size={18} color="#525252" />
            </div>
            <div
              className="round-button details"
              onClick={() => onDetailsClicked(forecast, isDay)}
            >
              <BarChart2Icon size={18} color="#525252" />
            </div>
          </div>
        </div>
        <div
          className="back"
          onMouseOut={() => setFlippedState(false, false)}
          onClick={() => setFlippedState(false, true)}
        >
          <span className="long">
            {forecast.LongPhrase ? forecast.LongPhrase : forecast.ShortPhrase}
          </span>
          <span className="temp-text">
            {t("forecast-card.temperature-between")}{" "}
            {getTemperature(
              forecast.temperature.Minimum.Unit,
              forecast.temperature.Minimum.Value
            )}{" "}
            {t("forecast-card.and")}{" "}
            {getTemperature(
              forecast.temperature.Maximum.Unit,
              forecast.temperature.Maximum.Value
            )}
          </span>
          <div
            className="back-image"
            style={{
              backgroundImage: `url(${getWeatherIcon(
                forecast.Icon,
                USE_MODERN_ICONS
              )})`
            }}
          ></div>
          {isSafari && (
            <div className="less" onClick={() => setFlippedState(false, true)}>
              {t("forecast-card.less")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
