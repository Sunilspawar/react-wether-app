export function takeOverConsole(callback) {
  const console = window.console;
  if (!console) return;

  function intercept(method) {
    const original = console[method];
    console[method] = function () {
      // own functionality - start
      if (typeof callback === "function") {
        callback(method, arguments);
      }
      // own functionality - end
      if (original.apply) {
        original.apply(console, arguments);
      } else {
        const message = Array.prototype.slice.apply(arguments).join(" ");
        original(message);
      }
    };
  }
  const methods = ["log", "warn", "error"];
  for (let i = 0; i < methods.length; i++) {
    intercept(methods[i]);
  }
}
