import * as React from "react";
import { useState } from "react";
import store from "../redux/store";
import { Loader as LoaderIcon } from "react-feather";

import "./Loader.scss";

export default function Loader() {
  const [showLoader, setShowLoader] = useState(false);

  store.subscribe(() => {
    const { loader } = store.getState();
    setShowLoader(loader.showLoader);
  });

  return showLoader ? (
    <div className="loader-container">
      <div className="loader-wrapper">
        <LoaderIcon size={48} />
      </div>
    </div>
  ) : null;
}
