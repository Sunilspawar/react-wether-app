export function getQueryParameters() {
  let obj = {};
  let params = window.location.search;
  if (!params) {
    return obj;
  }
  params = params.replace("?", "");
  const paramArr = params.split("&");
  for (let param of paramArr) {
    const arr = param.split("=");
    obj[arr[0]] = arr[1] ? arr[1] : null;
  }

  return obj;
}

export function isParamWithValueAvailable(paramName, paramValue) {
  const obj = getQueryParameters();
  for (let key in obj) {
    if (key === paramName) {
      return obj[key] === paramValue;
    } else {
      return false;
    }
  }

  return false;
}
