import React, { useEffect, useRef } from "react";

import Section from "../../components/Section";

import css from "./Details.module.css";

function size(node) {
  node.style.setProperty(
    "--counter-size",
    Math.round(node.getBoundingClientRect().height / 2) + "px"
  );
}

const Counter = ({ className, title, count, label }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;

    const resize = () => size(ref.current);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [ref]);
  return (
    <Section className={className} title={title}>
      <div className={css.counterWrapper} ref={ref}>
        <div className={css.counter}>{count}</div>
        <span>{label}</span>
      </div>
    </Section>
  );
};

export default Counter;
export { Counter };
