import { useRef, useEffect, useState } from "react";
import { getXYCoordinatesOfOrb } from "../utils/half-circle-percentage";
import { isNowBetweenDates } from "../utils/date";

const orbStates = {
  RISE: "rise",
  SET: "set"
};

export default function RiseSet({
  rise,
  set,
  children
}: {
  rise: string;
  set: string;
  children: any;
}) {
  const halfCircleElement = useRef<HTMLDivElement>(null);
  const orbElement = useRef<HTMLDivElement>(null);
  const [orbStyle, setOrbStyle] = useState({});

  const getOrbSize = () => {
    return {
      width: orbElement.current ? orbElement.current.clientWidth : 0,
      height: orbElement.current ? orbElement.current.clientHeight : 0
    };
  };

  const getRadiusOfHalfCircle = () => {
    const d = halfCircleElement.current
      ? halfCircleElement.current.clientWidth / 2
      : 0;
    return Math.round(d);
  };

  const getNowPercentage = () => {
    const riseTS = new Date(rise).getTime();
    const setTS = new Date(set).getTime();
    const now = Date.now();

    return (now - riseTS) / (setTS - riseTS);
  };

  const calculateOrbPosition = () => {
    const radius = getRadiusOfHalfCircle();
    const percentage = getNowPercentage();
    const orbSize = getOrbSize();
    const { x, y } = getXYCoordinatesOfOrb(radius, percentage);
    const pointX = Math.round(x) - orbSize.width / 2;
    const pointY = Math.round(y) - orbSize.height / 2;

    setOrbStyle({
      bottom: `${pointY}px`,
      left: `${pointX}px`
    });
  };

  const getNearestOrbState = () => {
    const riseTS = new Date(rise).getTime();
    const setTS = new Date(set).getTime();
    const now = Date.now();

    if (Math.abs(riseTS - now) < Math.abs(setTS - now)) {
      return orbStates.RISE;
    } else {
      return orbStates.SET;
    }
  };

  const setOrbPositionByState = () => {
    const orbState = getNearestOrbState();
    const radius = getRadiusOfHalfCircle();
    const orbSize = getOrbSize();
    let pointX;
    let pointY;

    if (orbState === orbStates.RISE) {
      const { x, y } = getXYCoordinatesOfOrb(radius, 0);
      pointX = Math.round(x) - orbSize.width / 2;
      pointY = Math.round(y) - orbSize.height / 2;
    } else {
      const { x, y } = getXYCoordinatesOfOrb(radius, 1);
      pointX = Math.round(x) - orbSize.width / 2;
      pointY = Math.round(y) - orbSize.height / 2;
    }

    setOrbStyle({
      bottom: `${pointY}px`,
      left: `${pointX}px`
    });
  };

  useEffect(() => {
    if (isNowBetweenDates(rise, set)) {
      calculateOrbPosition();
    } else {
      setOrbPositionByState();
    }
  }, []);

  const getTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="rise-container">
      <div className="icon-container">
        <div className="half-circle" ref={halfCircleElement}>
          <div className="orb" ref={orbElement} style={orbStyle}>
            {children}
          </div>
        </div>
      </div>
      <div className="text-container">
        <span>{getTime(rise)}</span>
        <span>{getTime(set)}</span>
      </div>
    </div>
  );
}
