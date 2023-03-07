export function transformLocationData(details) {
  const { annotations, formatted, components, geometry } = details;
  const location = {
    name: formatted,
    flag: annotations.flag,
    roadinfo: annotations.roadinfo,
    callingcode: annotations.callingcode,
    currency: {
      name: annotations.currency.name,
      iso_code: annotations.currency.iso_code,
      symbol: annotations.currency.symbol,
      alternate_symbols: annotations.currency.alternate_symbols,
      smallest_denomination: annotations.currency.smallest_denomination,
      subunit: annotations.currency.subunit,
      subunit_to_unit: annotations.currency.subunit_to_unit
    },
    components: {
      continent: components.continent,
      country: components.country,
      region: components.region,
      country_code: components.country_code
    },
    timezone: {
      name: annotations.timezone.name,
      short_name: annotations.timezone.short_name,
      offset_string: annotations.timezone.offset_string
    },
    dms: annotations.DMS,
    osm: annotations.OSM.url,
    geometry
  };

  return location;
}
