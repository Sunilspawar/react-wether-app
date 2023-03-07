import { AccuForecastUnit, Geometry } from "./accu-forecast";

export interface AccuCurrentConditions {
  ApparentTemperature: ImperialMetricUnit;
  Ceiling: ImperialMetricUnit;
  CloudCover: number;
  DewPoint: ImperialMetricUnit;
  EpochTime: number;
  HasPrecipitation: boolean;
  IndoorRelativeHumidity: number;
  IsDayTime: boolean;
  Link: string;
  LocalObservationDateTime: string;
  MobileLink: string;
  ObstructionsToVisibility: string;
  Past24HourTemperatureDeparture: ImperialMetricUnit;
  Precip1hr: ImperialMetricUnit;
  PrecipitationSummary: PrecipitationSummary;
  PrecipitationType: string;
  Pressure: ImperialMetricUnit;
  PressureTendency: PressureTendency;
  RealFeelTemperature: ImperialMetricUnit;
  RealFeelTemperatureShade: ImperialMetricUnit;
  RelativeHumidity: number;
  Temperature: ImperialMetricUnit;
  TemperatureSummary: TemperatureSummary;
  UVIndex: number;
  UVIndexText: string;
  Visibility: Visibility;
  WeatherIcon: number;
  WeatherText: string;
  WetBulbTemperature: ImperialMetricUnit;
  Wind: Wind;
  WindChillTemperature: ImperialMetricUnit;
  WindGust: WindGust;
  geometry: Geometry;
  locationKey: string;
  savedAt: number;
}

export interface ImperialMetricUnit {
  Imperial: AccuForecastUnit;
  Metric: AccuForecastUnit;
}

export interface PrecipitationSummary {
  Past3Hours: ImperialMetricUnit;
  Past6Hours: ImperialMetricUnit;
  Past9Hours: ImperialMetricUnit;
  Past12Hours: ImperialMetricUnit;
  Past18Hours: ImperialMetricUnit;
  Past24Hours: ImperialMetricUnit;
  PastHour: ImperialMetricUnit;
  Precipitation: ImperialMetricUnit;
}

export interface PressureTendency {
  LocalizedText: string;
  Code: string;
}

export interface TemperatureSummary {
  Past6HourRange: ImperialMetricUnit;
  Past12HourRange: ImperialMetricUnit;
  Past24HourRange: ImperialMetricUnit;
}

export interface Wind {
  Direction: WindDirection;
  Speed: ImperialMetricUnit;
}

export interface WindDirection {
  Degrees: number;
  English: string;
  Localized: string;
}

export interface WindGust {
  Speed: ImperialMetricUnit;
}

export interface Visibility {
  Imperial: AccuForecastUnit;
  Metric: AccuForecastUnit;
  ObstructionsToVisibility: string;
}
