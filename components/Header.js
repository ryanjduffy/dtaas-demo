import classnames from "classnames/bind";
import React from "react";

import css from "./Header.module.css";

const cx = classnames.bind(css);

const Header = ({ className, children }) => (
  <div className={cx(css.header, className)}>{children}</div>
);

export default Header;
export { Header };
