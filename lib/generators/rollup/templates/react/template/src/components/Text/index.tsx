import React, { FC } from "react";
import styles from "./index.less"

export interface TextProps {
  text: string;
}

const Text: FC<TextProps> = (props) => {
  const { text = "" } = props;
  return <div className={styles.text}>{text}</div>;
};

export default Text;