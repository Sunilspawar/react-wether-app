export function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

export function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

export function mphToKmh(mph) {
  return mph * 1.609;
}

export function kmhToMph(kmh) {
  return kmh / 1.609;
}

export function inToCm(inch) {
  return inch * 2.54;
}

export function cmToIn(cm) {
  return cm / 2.54;
}
