export function datesAreOnSameDay(firstDate, secondDate) {
  const first = new Date(firstDate);
  const second = new Date(secondDate);

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function convertEpochToDate(epoch) {
  const date = new Date(0);
  date.setUTCSeconds(epoch);

  return date;
}

export function getDayOfWeek(date) {
  return weekDays[date.getDay()];
}

export function getDayOfWeekFromEpoch(epoch) {
  const date = convertEpochToDate(epoch);

  return getDayOfWeek(date);
}

export function getHourAndTimeFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function getHourMinutesSecondsFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function dateOlderThanGivenDays(timestamp, days) {
  const now = new Date().getTime();
  const diffDays = (now - timestamp) / 1000 / 60 / 60 / 24;

  return diffDays > days;
}

export function dateOlderThanGivenHours(timestamp, hours) {
  const now = new Date().getTime();
  const diffHours = (now - timestamp) / 1000 / 60 / 60;

  return diffHours > hours;
}

export function isNowBetweenDates(from, to) {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();
  const now = Date.now();

  return fromMs <= now && toMs >= now;
}

const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];
