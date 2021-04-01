import classnames from "classnames/bind";
import React from "react";

import css from "./Header.module.css";

const cx = classnames.bind(css);

const Header = ({ actions, className, children }) => (
  <div className={cx(css.header, className)}>
    <span className={css.text}>{children}</span>
    {actions ? <span className={css.actions}>{actions}</span> : null}
  </div>
);

export default Header;
export { Header };
