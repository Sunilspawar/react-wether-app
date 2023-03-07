import React, { useState } from "react";
import { connect } from "react-redux";
import {
  toggleTemperature,
  toggleWindSpeed,
  togglePrecipitation,
  toggleLanguage
} from "../redux/actions";
import store from "../redux/store";
import {
  Thermometer as ThermometerIcon,
  Wind as WindIcon,
  Droplet as DropletIcon,
  XCircle as XCircleIcon,
  Globe as GlobeIcon
} from "react-feather";

import "./UnitChanger.scss";
import { useTranslation } from "react-i18next";
import { useHandleClickOutside } from "../utils/useHandleClickOutside";

interface Props {
  toggleTemperature: any;
  toggleWindSpeed: any;
  togglePrecipitation: any;
  toggleLanguage: any;
}

function UnitChanger(props: Props) {
  const [showInfo, setShowInfo] = useState(false);
  const [temp, setTemp] = useState("c");
  const [speed, setSpeed] = useState("kmh");
  const [precipitation, setPrecipitation] = useState("cm");
  const [language, setLanguage] = useState("en");
  const { t } = useTranslation("common");

  const wrapperEl = useHandleClickOutside(() => {
    setShowInfo(false);
  }, showInfo);

  const onTemperatureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.toggleTemperature(event.target.value);
  };

  const onWindSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.toggleWindSpeed(event.target.value);
  };

  const onPrecipitationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    props.togglePrecipitation(event.target.value);
  };

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.toggleLanguage(event.target.value);
  };

  store.subscribe(() => {
    const { units } = store.getState();
    if (units.temperature !== temp) {
      setTemp(units.temperature);
    }
    if (units.windSpeed !== speed) {
      setSpeed(units.windSpeed);
    }
    if (units.precipitation !== precipitation) {
      setPrecipitation(units.precipitation);
    }
    if (units.language !== language) {
      setLanguage(units.language);
    }
  });

  return (
    <div className="unit-changer-wrapper">
      <span
        className="change-units-clickable"
        onClick={() => setShowInfo(!showInfo)}
      >
        {!showInfo ? t("unit-changer.title") : ""}
      </span>
      {showInfo && (
        <div className="select-container" ref={wrapperEl}>
          <span>{t("unit-changer.title")}</span>
          <button
            className="close-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            <XCircleIcon size={22} color="#656565" />
          </button>
          <div className="unit-select">
            <ThermometerIcon size={18} />
            <select value={temp} onChange={onTemperatureChange}>
              <option value="c">&deg;C</option>
              <option value="f">F</option>
            </select>
          </div>
          <div className="unit-select">
            <WindIcon size={18} />
            <select value={speed} onChange={onWindSpeedChange}>
              <option value="mph">mph</option>
              <option value="kmh">km/h</option>
            </select>
          </div>
          <div className="unit-select">
            <DropletIcon size={18} />
            <select value={precipitation} onChange={onPrecipitationChange}>
              <option value="in">in</option>
              <option value="cm">cm</option>
            </select>
          </div>
          <div className="unit-select">
            <GlobeIcon size={18} />
            <select value={language} onChange={onLanguageChange}>
              <option value="en">{t("unit-changer.english")}</option>
              <option value="hu">{t("unit-changer.hungarian")}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(null, {
  toggleTemperature,
  toggleWindSpeed,
  togglePrecipitation,
  toggleLanguage
})(UnitChanger);
