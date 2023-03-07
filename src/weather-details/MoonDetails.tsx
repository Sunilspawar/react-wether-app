import React from "react";
import { TFunction } from "i18next";
import { Moon as MoonIcon } from "react-feather";
import { withTranslation } from "react-i18next";
import RiseSet from "./RiseSet";

function MoonDetails({
  moonRise,
  moonSet,
  moonPhase,
  moonAge,
  t
}: {
  moonRise: string;
  moonSet: string;
  moonPhase: string;
  moonAge: number;
  t: TFunction;
}) {
  const getPhaseName = () => {
    // https://www.almanac.com/astronomy/moon/calendar
    switch (moonPhase) {
      case "New":
        return t("weather-details.moon-new");
      case "First":
        return t("weather-details.moon-first");
      case "WaxingCrescent":
        return t("weather-details.moon-waxing-crescent");
      case "WaxingGibbous":
        return t("weather-details.moon-waxing-gibbous");
      case "Full":
        return t("weather-details.moon-full");
      case "WaningGibbous":
        return t("weather-details.moon-waning-gibbous");
      case "Last":
        return t("weather-details.moon-last");
      case "WaningCrescent":
        return t("weather-details.moon-waning-crescent");
      default:
        return `TODO: ${moonPhase}`;
    }
  };
  return (
    <div className="details-container">
      <div className="icon">
        <MoonIcon size={32} />
      </div>
      <div className="content">
        <span>
          {t<string>("weather-details.moon-phase")} {getPhaseName()}
        </span>
        <span>
          {t<string>("weather-details.moon-age")} {moonAge}{" "}
          {t<string>("weather-details.moon-days")}
        </span>
        <br />
        <RiseSet rise={moonRise} set={moonSet}>
          <MoonIcon size={18} />
        </RiseSet>
      </div>
    </div>
  );
}

export default withTranslation("common")(MoonDetails);
