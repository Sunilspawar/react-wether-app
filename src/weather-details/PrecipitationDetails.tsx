import React, { useState, useEffect } from "react";
import { TFunction } from "i18next";
import { CloudRain as CloudRainIcon } from "react-feather";
import { withTranslation } from "react-i18next";
import store from "../redux/store";
import { inToCm, cmToIn } from "../utils/converters";
import {
  AccuForecastDayNightTransformed,
  AccuForecastUnit
} from "../interfaces/accu-forecast";

function PrecipitationDetails({
  details,
  t
}: {
  details: AccuForecastDayNightTransformed;
  t: TFunction;
}) {
  const [precipitationUnit, setPrecipitationUnit] = useState("cm");

  const setUnitType = () => {
    const { units } = store.getState();

    if (units.precipitation !== precipitationUnit) {
      setPrecipitationUnit(units.precipitation);
    }
  };

  useEffect(() => {
    setUnitType();

    const unsubscribe = store.subscribe(() => {
      setUnitType();
    });

    return unsubscribe;
  }, []);

  const getPrecipitationProbabilityWithHours = () => {
    let probs = "";
    const {
      RainProbability,
      SnowProbability,
      IceProbability,
      HoursOfRain,
      HoursOfSnow,
      HoursOfIce
    } = details;

    if (RainProbability) {
      probs += `${RainProbability}% ${t("weather-details.rain")}`;
      if (HoursOfRain) {
        probs += ` (${HoursOfRain}h)`;
      }
    }
    if (SnowProbability) {
      const snowStr = `${SnowProbability}% ${t("weather-details.snow")}`;
      probs += probs !== "" ? `, ${snowStr}` : snowStr;
      if (HoursOfSnow) {
        probs += ` (${HoursOfSnow}h)`;
      }
    }
    if (IceProbability) {
      const iceStr = `${IceProbability}% ${t("weather-details.ice")}`;
      probs += probs !== "" ? `, ${iceStr}` : iceStr;
      if (HoursOfIce) {
        probs += ` (${HoursOfIce}h)`;
      }
    }

    return probs;
  };

  const getLiquid = (liquid: AccuForecastUnit) => {
    switch (liquid.Unit) {
      case "in":
        if (precipitationUnit === "cm") {
          return `${inToCm(liquid.Value).toFixed(1)} cm`;
        } else {
          return `${liquid.Value} in`;
        }
      case "cm":
        if (precipitationUnit === "in") {
          return `${cmToIn(liquid.Value).toFixed(1)} cm`;
        } else {
          return `${liquid.Value} in`;
        }
      default:
        return `${liquid.Value} ${liquid.Unit}`;
    }
  };

  const getAllLiquid = (
    rain: AccuForecastUnit,
    snow: AccuForecastUnit,
    ice: AccuForecastUnit
  ) => {
    let liquids = "";
    if (rain.Value) {
      liquids += `${getLiquid(rain)} ${t("weather-details.rain")}`;
    }
    if (snow.Value) {
      const snowStr = `${getLiquid(snow)} ${t("weather-details.snow")}`;
      liquids += liquids !== "" ? `, ${snowStr}` : snowStr;
    }
    if (ice.Value) {
      const iceStr = `${getLiquid(ice)} ${t("weather-details.ice")}`;
      liquids += liquids !== "" ? `, ${iceStr}` : iceStr;
    }
    return liquids !== "" ? `${liquids}` : "";
  };

  return (
    <div className="details-container">
      <div className="icon">
        <CloudRainIcon size={32} />
        {details.PrecipitationProbability}%
      </div>
      <div className="content">
        <div>
          {t<string>("weather-details.prec-total-hours")}{" "}
          {details.HoursOfPrecipitation} h
        </div>
        <div>
          {t<string>("weather-details.prec-total-liquid")}{" "}
          {getLiquid(details.TotalLiquid)}
        </div>
        <div>
          {t<string>("weather-details.prec-cloud-cover")} {details.CloudCover}%
        </div>
        {details.ThunderstormProbability > 0 && (
          <div>
            {t<string>("weather-details.prec-thunderstorm")}{" "}
            {details.ThunderstormProbability}%
          </div>
        )}
        <div>{getPrecipitationProbabilityWithHours()}</div>
        <div>{getAllLiquid(details.Rain, details.Snow, details.Ice)}</div>
      </div>
    </div>
  );
}

export default withTranslation("common")(PrecipitationDetails);
