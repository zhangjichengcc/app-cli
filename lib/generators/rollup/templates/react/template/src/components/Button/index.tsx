import React, { FC } from "react";
import styles from "./index.less"

export interface ButtonProps {
  children: string | React.ReactElement;
}

const Button: FC<ButtonProps> = (props) => {
  const { children = "" } = props;
  return <button className={styles.text}>{children}</button>;
};

export default Button;