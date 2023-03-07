/* eslint-disable no-undef, no-unused-vars */
// Opera 8.0+
export const isOpera =
  (!!window.opr && !!opr.addons) ||
  !!window.opera ||
  navigator.userAgent.indexOf(" OPR/") >= 0;

// Firefox 1.0+
export const isFirefox = typeof InstallTrigger !== "undefined";

// Safari 3.0+ "[object HTMLElementConstructor]"
export const isSafari =
  /constructor/i.test(window.HTMLElement) ||
  (function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(
    !window["safari"] ||
      (typeof safari !== "undefined" && safari.pushNotification)
  );

// Internet Explorer 6-11
export const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
export const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
export const isChrome =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
export const isBlink = (isChrome || isOpera) && !!window.CSS;

export const BROWSER_OPERA = "BROWSER_OPERA";
export const BROWSER_FIREFOX = "BROWSER_FIREFOX";
export const BROWSER_SAFARI = "BROWSER_SAFARI";
export const BROWSER_IE = "BROWSER_IE";
export const BROWSER_EDGE = "BROWSER_EDGE";
export const BROWSER_CHROME = "BROWSER_CHROME";
export const BROWSER_BLINK = "BROWSER_BLINK";
export const BROWSER_UNKNOWN = "BROWSER_UNKNOWN";

export function getBrowser() {
  if (isOpera) {
    return BROWSER_OPERA;
  } else if (isFirefox) {
    return BROWSER_FIREFOX;
  } else if (isSafari) {
    return BROWSER_SAFARI;
  } else if (isIE) {
    return BROWSER_IE;
  } else if (isEdge) {
    return BROWSER_EDGE;
  } else if (isChrome) {
    return BROWSER_CHROME;
  } else if (isBlink) {
    return BROWSER_BLINK;
  } else {
    return BROWSER_UNKNOWN;
  }
}
