import { FC, ReactNode } from "react";
import classnames from "classnames";
import styles from "./index.module.less";

type Size = "large" | "small" | "default";
interface Props {
  children?: ReactNode;
  size?: Size;
}

const sizeMap: { [key in Size]: string } = {
  large: styles.large,
  small: styles.small,
  default: styles.default,
};

const Button: FC<Props> = (props) => {
  const { children, size = "default" } = props;

  const sizeStyle = sizeMap[size];

  return (
    <button className={classnames(styles.button, sizeStyle)}>{children}</button>
  );
};

export default Button;
