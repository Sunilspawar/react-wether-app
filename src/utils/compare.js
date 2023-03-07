export function compareCoordinates(first, second) {
  let bLat, lLat;
  let bLng, lLng;
  if (Math.abs(first.lat) > Math.abs(second.lat)) {
    bLat = Math.abs(first.lat);
    lLat = Math.abs(second.lat);
  } else {
    bLat = Math.abs(second.lat);
    lLat = Math.abs(first.lat);
  }
  if (Math.abs(first.lng) > Math.abs(second.lng)) {
    bLng = Math.abs(first.lng);
    lLng = Math.abs(second.lng);
  } else {
    bLng = Math.abs(second.lng);
    lLng = Math.abs(first.lng);
  }
  if (lLat / bLat > 0.999 && lLng / bLng > 0.999) {
    return true;
  }

  return false;
}
