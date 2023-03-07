export interface AccuForecast {
  DailyForecasts: DailyForecast[];
  geometry: Geometry;
  language: string;
  savedAt: number;
}

export interface DailyForecast {
  AirAndPollen: AccuForecastAirAndPollen[];
  Date: string;
  Day: AccuForecastDayNight;
  DegreeDaySummary: AccuForecastDegreeDaySummary;
  EpochDate: number;
  HoursOfSun: number;
  Link: string;
  MobileLink: string;
  Moon: AccuForecastMoon;
  Night: AccuForecastDayNight;
  RealFeelTemperature: AccuForecastTemperature;
  RealFeelTemperatureShade: AccuForecastTemperature;
  Sources: string[];
  Sun: AccuForecastSun;
  Temperature: AccuForecastTemperature;
}

export interface AccuHourByHourForecast {
  DateTime: string;
  EpochDateTime: number;
  HasPrecipitation: boolean;
  IconPhrase: string;
  IsDaylight: boolean;
  Link: string;
  MobileLink: string;
  PrecipitationProbability: number;
  PrecipitationIntensity: string;
  PrecipitationType: string;
  Temperature: AccuForecastUnit;
  WeatherIcon: number;
}

export interface Geometry {
  lat: number;
  lng: number;
}

export interface AccuForecastAirAndPollen {
  Category: string;
  CategoryValue: number;
  Name: string;
  Type: string;
  Value: number;
}

export interface AccuForecastDayNight {
  CloudCover: number;
  HasPrecipitation: boolean;
  HoursOfIce: number;
  HoursOfPrecipitation: number;
  HoursOfRain: number;
  HoursOfSnow: number;
  Ice: AccuForecastUnit;
  IceProbability: number;
  Icon: number;
  IconPhrase: string;
  LongPhrase: string;
  PrecipitationIntensity: string;
  PrecipitationProbability: number;
  PrecipitationType: string;
  Rain: AccuForecastUnit;
  RainProbability: number;
  ShortPhrase: string;
  Snow: AccuForecastUnit;
  SnowProbability: number;
  ThunderstormProbability: number;
  TotalLiquid: AccuForecastUnit;
  Wind: AccuForecastWind;
  WindGust: AccuForecastWind;
}

export interface ForecastOneDay {
  day: AccuForecastDayNightTransformed;
  night: AccuForecastDayNightTransformed;
}

export interface AccuForecastDayNightTransformed extends AccuForecastDayNight {
  id: number;
  date: number;
  details: AccuForecastDayNightDetails;
  temperature: AccuForecastTemperature;
}

export interface AccuForecastDayNightDetails {
  AirAndPollen: AccuForecastAirAndPollen[];
  DegreeDaySummary: AccuForecastDegreeDaySummary;
  HoursOfSun: number;
  Moon: AccuForecastMoon;
  RealFeelTemperature: AccuForecastTemperature;
  Sun: AccuForecastSun;
}

export interface AccuForecastUnit {
  Unit: string;
  UnitType: number;
  Value: number;
}

export interface AccuForecastWind {
  Direction: AccuForecastDirection;
  Speed: AccuForecastUnit;
}

export interface AccuForecastDirection {
  Degrees: number;
  English: string;
  Localized: string;
}

export interface AccuForecastDegreeDaySummary {
  Cooling: AccuForecastUnit;
  Heating: AccuForecastUnit;
}

export interface AccuForecastMoon {
  Age: number;
  EpochRise: number;
  EpochSet: number;
  Phase: string;
  Rise: string;
  Set: string;
}

export interface AccuForecastTemperature {
  Maximum: AccuForecastUnit;
  Minimum: AccuForecastUnit;
}

export interface AccuForecastSun {
  EpochRise: number;
  EpochSet: number;
  Rise: string;
  Set: string;
}
