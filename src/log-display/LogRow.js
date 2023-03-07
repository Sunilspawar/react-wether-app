import React from "react";

import "./LogDisplay.scss";

export default function LogRow({ time, type, message }) {
  return (
    <div className={type + " log-row"}>
      <div className="time">{time}</div>
      <div className="type">{type}</div>
      <div className="message">{message}</div>
    </div>
  );
}
