import { FC, ReactNode } from "react";
import styles from "./index.module.less";

interface Props {
  label: ReactNode;
}

const Input: FC<Props> = (props) => {
  const { label } = props;

  return (
    <div className={styles.input}>
      {label}
      <input />
    </div>
  );
};

export default Input;
