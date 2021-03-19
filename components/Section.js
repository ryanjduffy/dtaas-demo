import classnames from "classnames/bind";

import Header from "./Header";

import css from "./Section.module.css";

const cx = classnames.bind(css);

const Section = ({ children, className, title, ...rest }) => (
  <section {...rest} className={cx(css.section, className)}>
    {title ? <Header className={css.header}>{title}</Header> : null}
    <div className={css.body}>{children}</div>
  </section>
);

export default Section;
export { Section };
