import * as React from "react";
import { TFunction } from "i18next";
import { Truck as TruckIcon } from "react-feather";
import { withTranslation } from "react-i18next";
import { RoadInfo } from "../interfaces/location";

function RoadDetails({ roadinfo, t }: { roadinfo: RoadInfo; t: TFunction }) {
  return (
    <div className="info-block">
      <TruckIcon size={24} />
      <div className="values">
        {t<string>("location-info.driving-on", {
          on: roadinfo.drive_on,
          unit: roadinfo.speed_in
        })}
      </div>
    </div>
  );
}

export default withTranslation("common")(RoadDetails);
