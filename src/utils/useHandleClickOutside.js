import { useRef, useEffect } from "react";

export const useHandleClickOutside = (callback, input) => {
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (!ref.current || ref.current.contains(event.target)) {
      return;
    }
    callback();
  };

  useEffect(() => {
    if (input) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [input]);

  return ref;
};
