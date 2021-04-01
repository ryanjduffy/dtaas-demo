import React from "react";

import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
import Section from "../../components/Section";
import Weather from "../../components/Weather";

import css from "./Overview.module.css";

const Overview = ({ data, lat, lon, mode, onSelectMode }) => {
  return (
    <div className={css.overview}>
      <div className={css.weather}>
        <Weather lat={lat} lon={lon} />
      </div>
      <BarChart className={css.data} data={data} />
      <Section title="Event History" className={css.graph}>
        <LineChart data={data} mode={mode} onSelectMode={onSelectMode} />
      </Section>
    </div>
  );
};

export default Overview;
export { Overview };
