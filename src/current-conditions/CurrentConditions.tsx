import * as React from "react";
import { useState, useEffect } from "react";
import { getWeatherIcon } from "../services/AccuWeatherService";
import store from "../redux/store";
import { dateOlderThanGivenHours } from "../utils/date";
import {
  XCircle as XCircleIcon,
  RefreshCw as RefreshCwIcon,
  Thermometer as ThermometerIcon,
  CloudRain as CloudRainIcon,
  Wind as WindIcon,
  Navigation2 as Navigation2Icon,
  Cloud as CloudIcon,
  TrendingDown as TrendingDownIcon,
  UploadCloud as UploadCloudIcon,
  Droplet as DropletIcon,
  Eye as EyeIcon,
  Sun as SunIcon,
  Umbrella as UmbrellaIcon
} from "react-feather";
import HourByHourForecast from "../hour-by-hour-forecast/HourByHourForecast";

import "./CurrentConditions.scss";
import { useTranslation } from "react-i18next";
import { useHandleClickOutside } from "../utils/useHandleClickOutside";
import {
  AccuCurrentConditions,
  ImperialMetricUnit,
  Visibility
} from "../interfaces/current-conditions";
import { AccuHourByHourForecast } from "../interfaces/accu-forecast";

export default function CurrentConditions({
  currentConditions,
  hourByHourForecast,
  onRefreshCurrentConditionsClicked
}: {
  currentConditions: AccuCurrentConditions;
  hourByHourForecast: AccuHourByHourForecast[];
  onRefreshCurrentConditionsClicked: any;
}) {
  const [showCurrentConditions, setShowCurrentConditions] = useState(false);
  const [temperature, setTemperature] = useState("c");
  const [windSpeed, setWindSpeed] = useState("kmh");
  const [precipitation, setPrecipitation] = useState("cm");
  const { t } = useTranslation("common");

  const wrapperRef = useHandleClickOutside(() => {
    setShowCurrentConditions(false);
  }, showCurrentConditions);

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

  useEffect(() => {
    if (showCurrentConditions) {
      const {
        forecast: {
          currentConditions: { savedAt }
        }
      } = store.getState();
      if (dateOlderThanGivenHours(savedAt, 1)) {
        onRefreshCurrentConditionsClicked();
      }
    }
  }, [showCurrentConditions]);

  const getFormattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month} ${hour}:${minute}`;
  };

  const getTemperature = (temp: ImperialMetricUnit) => {
    const { Metric, Imperial } = temp;

    if (temperature === "c") {
      return <span>{Metric.Value} &#176;C</span>;
    } else {
      return <span>{Imperial.Value} F</span>;
    }
  };

  const getPrecipitation = (prec: ImperialMetricUnit) => {
    const { Metric, Imperial } = prec;
    const ret = precipitation === "cm" ? Metric : Imperial;
    return (
      <span>
        {ret.Value} {ret.Unit}
      </span>
    );
  };

  const getWindSpeed = (wind: ImperialMetricUnit) => {
    const { Metric, Imperial } = wind;
    const ret = windSpeed === "kmh" ? Metric : Imperial;
    return (
      <span>
        {ret.Value} {ret.Unit}
      </span>
    );
  };

  const getPressure = (pressure: ImperialMetricUnit, tendency: string) => {
    const { Metric, Imperial } = pressure;
    const ret = windSpeed === "kmh" ? Metric : Imperial;
    return (
      <span>
        {ret.Value} {windSpeed === "kmh" ? "hPa" : ret.Unit} ({tendency})
      </span>
    );
  };

  const getVisibility = (visibility: Visibility) => {
    const { Metric, Imperial, ObstructionsToVisibility } = visibility;
    const ret = windSpeed === "kmh" ? Metric : Imperial;
    const obs = ObstructionsToVisibility ? `(${ObstructionsToVisibility})` : "";
    return (
      <span>
        {ret.Value} {ret.Unit} {obs}
      </span>
    );
  };

  const getCloudCeiling = (ceiling: ImperialMetricUnit) => {
    const { Metric, Imperial } = ceiling;
    const ret = windSpeed === "kmh" ? Metric : Imperial;
    return (
      <span>
        {ret.Value} {ret.Unit}
      </span>
    );
  };

  return (
    <>
      <div
        className="current-conditions-button"
        onClick={() => setShowCurrentConditions(!showCurrentConditions)}
      >
        {t("current-conditions.title")}
      </div>
      {showCurrentConditions && (
        <div className="current-conditions-wrapper" ref={wrapperRef}>
          <div className="title-wrapper">
            {t("current-conditions.title")} (
            {getFormattedDate(currentConditions.LocalObservationDateTime)})
            <button
              className="refresh-button"
              onClick={() => onRefreshCurrentConditionsClicked()}
            >
              <RefreshCwIcon size={18} color="#5d5959" />
            </button>
          </div>
          <button
            className="close-button"
            onClick={() => setShowCurrentConditions(!showCurrentConditions)}
          >
            <XCircleIcon size={22} color="#656565" />
          </button>
          <div className="conditions-container">
            <div className="icon-and-text">
              <img
                src={getWeatherIcon(currentConditions.WeatherIcon, true)}
                alt={currentConditions.WeatherText}
              />
              <span>{currentConditions.WeatherText}</span>
            </div>
            <div className="condition-line">
              <div className="icon">
                <ThermometerIcon size={24} />
                <span className="description">
                  {t("current-conditions.temperature")}
                </span>
              </div>
              {getTemperature(currentConditions.Temperature)}
              &nbsp;/ {t("current-conditions.real-feel")}{" "}
              {getTemperature(currentConditions.RealFeelTemperature)}
            </div>
            <div className="condition-line">
              <div className="icon">
                <UmbrellaIcon size={24} />
                <span className="description">
                  {t("current-conditions.precipitation")}
                </span>
              </div>
              {getPrecipitation(
                currentConditions.PrecipitationSummary.Precipitation
              )}
              &nbsp;
              {currentConditions.PrecipitationType}
            </div>
            <div className="condition-line">
              <div className="icon">
                <CloudIcon size={24} />
                <span className="description">
                  {t("current-conditions.cloud")}
                </span>
              </div>
              <span>
                {currentConditions.CloudCover}% {t("current-conditions.cover")}
              </span>
            </div>
            <div className="condition-line">
              <div className="icon">
                <WindIcon size={24} />
                <span className="description">
                  {t("current-conditions.wind")}
                </span>
              </div>
              {getWindSpeed(currentConditions.Wind.Speed)}
              <Navigation2Icon
                size={14}
                style={{
                  transform: `rotate(${
                    currentConditions.Wind.Direction.Degrees + 0
                  }deg)`
                }}
              />
            </div>
            <div className="condition-line">
              <div className="icon">
                <TrendingDownIcon size={24} />
                <span className="description">
                  {t("current-conditions.pressure")}
                </span>
              </div>
              {getPressure(
                currentConditions.Pressure,
                currentConditions.PressureTendency.LocalizedText
              )}
            </div>
            <div className="condition-line">
              <div className="icon">
                <UploadCloudIcon size={24} />
                <span className="description">
                  {t("current-conditions.ceiling")}
                </span>
              </div>
              {getCloudCeiling(currentConditions.Ceiling)}
            </div>
            <div className="condition-line">
              <div className="icon">
                <DropletIcon size={24} />
                <span className="description">
                  {t("current-conditions.humidity")}
                </span>
              </div>
              <span>
                {currentConditions.RelativeHumidity}% (
                {currentConditions.IndoorRelativeHumidity}%{" "}
                {t("current-conditions.indoor")})
              </span>
            </div>
            <div className="condition-line">
              <div className="icon">
                <EyeIcon size={24} />
                <span className="description">
                  {t("current-conditions.visibility")}
                </span>
              </div>
              {getVisibility(currentConditions.Visibility)}
            </div>
            <div className="condition-line">
              <div className="icon">
                <CloudRainIcon size={24} />
                <span className="description">
                  {t("current-conditions.dewpoint")}
                </span>
              </div>
              <span>at</span>
              {getTemperature(currentConditions.DewPoint)}
            </div>
            <div className="condition-line">
              <div className="icon">
                <SunIcon size={24} />
                <span className="description">UV</span>
              </div>
              <span>
                {currentConditions.UVIndexText} ({currentConditions.UVIndex})
              </span>
            </div>
            <HourByHourForecast hourByHourForecast={hourByHourForecast} />
          </div>
        </div>
      )}
    </>
  );
}
