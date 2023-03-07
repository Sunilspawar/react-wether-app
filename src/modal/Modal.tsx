import React from "react";
import { XCircle as XCircleIcon } from "react-feather";

import "./Modal.scss";

export default function Modal({
  show,
  children,
  onClose
}: {
  show: boolean;
  children: any;
  onClose: any;
}) {
  if (!show) {
    return null;
  } else {
    return (
      <div className="modal-backdrop">
        <div className="modal-container">
          <div className="modal-close-button" onClick={onClose}>
            <XCircleIcon size={22} color="#656565" />
          </div>
          <div className="modal-content">{children}</div>
        </div>
      </div>
    );
  }
}
