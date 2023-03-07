import * as React from "react";
import { useState } from "react";
import ForecastDay from "./ForecastDay";

import "./ForecastList.scss";
import { useIsAccuweather } from "../utils/useIsAccuweather";
import { DailyForecast, ForecastOneDay } from "../interfaces/accu-forecast";

export default function ForecastList({
  periods,
  onDetailsClicked
}: {
  periods: DailyForecast[];
  onDetailsClicked?: any;
}) {
  const initialState: ForecastOneDay[] | any = [];
  const [convertedPeriods, setConvertedPeriods] = useState(initialState);

  const convertOpenWeatherResponse = () => {
    let period;
    const cPeriods = [];
    cPeriods.push({ day: {}, night: periods[0] });
    for (let i = 1; i < periods.length; i += 2) {
      period = {
        day: periods[i],
        night: periods[i + 1]
      };
      cPeriods.push(period);
    }
    setConvertedPeriods(cPeriods);
  };

  const convertAccuWeatherResponse = () => {
    let period;
    const cPeriods = [];
    for (let i = 0; i < periods.length; i++) {
      const {
        Sun,
        Moon,
        RealFeelTemperature,
        HoursOfSun,
        AirAndPollen,
        DegreeDaySummary
      } = periods[i];
      const details = {
        Sun,
        Moon,
        RealFeelTemperature,
        HoursOfSun,
        AirAndPollen,
        DegreeDaySummary
      };
      period = {
        day: {
          id: 100 - i,
          date: periods[i].EpochDate,
          temperature: periods[i].Temperature,
          details,
          ...periods[i].Day
        },
        night: {
          id: 50 - i,
          date: periods[i].EpochDate,
          temperature: periods[i].Temperature,
          details,
          ...periods[i].Night
        }
      };
      cPeriods.push(period);
    }
    setConvertedPeriods(cPeriods);
  };

  const isAccuWeather = useIsAccuweather(
    periods,
    convertOpenWeatherResponse,
    convertAccuWeatherResponse
  );

  return (
    <div className="day-list">
      {!isAccuWeather &&
        convertedPeriods.map((day: any) => (
          <ForecastDay
            key={day.day ? day.day.number : day.night.number}
            day={day}
            isAccuWeather={isAccuWeather}
            onDetailsClicked={onDetailsClicked}
          />
        ))}
      {isAccuWeather &&
        convertedPeriods.map((day: ForecastOneDay) => (
          <ForecastDay
            key={day.day ? day.day.id : day.night.id}
            day={day}
            isAccuWeather={isAccuWeather}
            onDetailsClicked={onDetailsClicked}
          />
        ))}
    </div>
  );
}
