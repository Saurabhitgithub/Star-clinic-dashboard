import React from "react";
import style from "./input.module.css";

export const Label = ({ required, children, className }) => {
  if (!children) return null;
  return (
    <label className={`${style.label_text} ${className}`}>
      {children}
      {required && <span className={style.star_icon}>*</span>}
    </label>
  );
};
