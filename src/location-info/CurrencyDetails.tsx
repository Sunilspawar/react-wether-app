import * as React from "react";
import { TFunction } from "i18next";
import { DollarSign as DollarSignIcon } from "react-feather";
import { withTranslation } from "react-i18next";
import { Currency } from "../interfaces/location";

function CurrencyDetails({
  currency,
  t
}: {
  currency: Currency;
  t: TFunction;
}) {
  const getSymbols = () => {
    let symbols = currency.symbol;
    if (currency.alternate_symbols.length > 0) {
      symbols += `, ${currency.alternate_symbols.join(", ")}`;
    }

    return symbols;
  };

  const getSubUnit = () => {
    const { subunit, subunit_to_unit, symbol } = currency;
    return `${subunit} (${subunit_to_unit} ${subunit} = 1 ${symbol})`;
  };

  return (
    <div className="info-block">
      <DollarSignIcon size={24} />
      <div className="values">
        <span className="value">{currency.name}</span>
        <span className="value">
          {currency.iso_code} ({getSymbols()})
        </span>
        <span className="value">
          {t<string>("location-info.smallest-denomination")}{" "}
          {currency.smallest_denomination}
        </span>
        {currency.subunit && (
          <span className="value">
            {t<string>("location-info.subunit")} {getSubUnit()}
          </span>
        )}
      </div>
    </div>
  );
}

export default withTranslation("common")(CurrencyDetails);
