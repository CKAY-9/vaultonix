"use client"

import style from "./popup.module.scss";

const Popup = (props: {
  children: any
}) => {
  return (
    <div className={style.popup}>
      <div className={style.content}>
        {props.children}
      </div>
    </div>
  );
}

export default Popup;