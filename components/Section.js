import classnames from "classnames/bind";

import Header from "./Header";

import css from "./Section.module.css";

const cx = classnames.bind(css);

const Section = ({ actions, children, className, title, ...rest }) => (
  <section {...rest} className={cx(css.section, className)}>
    {title ? (
      <Header actions={actions} className={css.header}>
        {title}
      </Header>
    ) : null}
    <div className={css.body}>{children}</div>
  </section>
);

export default Section;
export { Section };
