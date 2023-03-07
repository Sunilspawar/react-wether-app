import * as React from "react";
import { TFunction } from "i18next";
import { Phone as PhoneIcon } from "react-feather";
import { withTranslation } from "react-i18next";

function CallDetails({
  callingcode,
  t
}: {
  callingcode: number;
  t: TFunction;
}) {
  return (
    <div className="info-block">
      <PhoneIcon size={24} />
      <div className="values">
        {t<string>("location-info.calling-code")} +{callingcode}
      </div>
    </div>
  );
}

export default withTranslation("common")(CallDetails);
