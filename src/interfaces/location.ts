import { Geometry } from "./accu-forecast";

export interface ForecastLocation {
  callingcode: number;
  components: LocationComponents;
  currency: Currency;
  dms: DMS;
  flag: string;
  geometry: Geometry;
  name: string;
  osm: string;
  roadinfo: RoadInfo;
  timezone: TimeZone;
}

export interface LocationSearchResult {
  annotations: LocationSearchResultAnnotations;
  bounds: LocationSearchResultBounds;
  components: LocationSearchResultComponents;
  confidence: number;
  formatted: string;
  geometry: Geometry;
}

export interface PinnedForecastLocations {
  [key: string]: ForecastLocation;
}

export interface LocationComponents {
  continent: string;
  country: string;
  country_code: string;
  region: string;
}

export interface Currency {
  alternate_symbols: string[];
  iso_code: string;
  name: string;
  smallest_denomination: number;
  subunit: string;
  subunit_to_unit: number;
  symbol: string;
}

export interface DMS {
  lat: string;
  lng: string;
}

export interface RoadInfo {
  drive_on: string;
  speed_in: string;
}

export interface TimeZone {
  name: string;
  offset_string: string;
  short_name: string;
}

export interface LocationSearchResultAnnotations {
  DMS: Geometry;
  MGRS: string;
  Maidenhead: string;
  Mercator: LocationSearchResultMercator;
  OSM: LocationSearchResultOSM;
  UN_M49: LocationSearchResultUNM49;
  callingcode: number;
  currency: Currency;
  flag: string;
  geohash: string;
  qibla: number;
  roadinfo: RoadInfo;
  sun: LocationSearchResultSunRiseSet;
  timezone: LocationSearchResultTimeZone;
  what3words: LocationSearchResultWords;
}

export interface LocationSearchResultMercator {
  x: number;
  y: number;
}

export interface LocationSearchResultOSM {
  edit_url: string;
  note_url: string;
  url: string;
}

export interface LocationSearchResultUNM49 {
  regions: UNM49Regions;
  statistical_groupings: string[];
}

export interface UNM49Regions {
  [key: string]: string;
}

export interface LocationSearchResultSunRiseSet {
  rise: LocationSearchResultSunRiseSetDetails;
  set: LocationSearchResultSunRiseSetDetails;
}

export interface LocationSearchResultSunRiseSetDetails {
  apparent: number;
  astronomical: number;
  civil: number;
  nautical: number;
}

export interface LocationSearchResultTimeZone extends TimeZone {
  now_in_dst: number;
  offset_sec: number;
}

export interface LocationSearchResultWords {
  words: string;
}

export interface LocationSearchResultBounds {
  northeast: Geometry;
  southwest: Geometry;
}

export interface LocationSearchResultComponents {
  "ISO_3166-1_alpha-2": string;
  "ISO_3166-1_alpha-3": string;
  continent: string;
  country: string;
  country_code: string;
  state: string;
  state_code: string;
  town: string;
  _category: string;
  _type: string;
}
