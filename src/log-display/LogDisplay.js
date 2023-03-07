import React, { useState, useEffect, useRef } from "react";
import { getHourMinutesSecondsFromTimestamp } from "../utils/date";
import LogRow from "./LogRow";

import "./LogDisplay.scss";

const MAX_LOG_LENGTH = 20;

export default function LogDisplay({ args, type }) {
  const containerEl = useRef(null);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    addNewMessage(type, args);
  }, [args, type]);

  const addNewMessage = (type, args) => {
    if (!type || !args) return;

    let message = "";
    switch (type) {
      case "log":
        message = Object.values(args).join(", ");
        break;
      case "error":
      case "warn":
        message = args;
        break;
      default:
        break;
    }

    const newRow = {
      time: getHourMinutesSecondsFromTimestamp(Date.now()),
      type,
      message
    };

    let oldLogs;
    if (logs.length >= MAX_LOG_LENGTH) {
      oldLogs = logs.slice(1, logs.length - 1);
    } else {
      oldLogs = logs;
    }
    const newLogs = [...oldLogs, newRow];

    setLogs(newLogs);
  };

  return (
    <div className="log-display-container">
      <div className="log-link" onClick={() => setShowLog(!showLog)}>
        {showLog ? "Hide" : "Show"} log
      </div>
      <div
        className={showLog ? "log-container" : "log-container hidden"}
        ref={containerEl}
      >
        {logs.map((log) => (
          <LogRow
            key={log.time}
            time={log.time}
            type={log.type}
            message={log.message}
          />
        ))}
      </div>
    </div>
  );
}
