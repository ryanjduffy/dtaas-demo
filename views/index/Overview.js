import React from "react";

import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
import Section from "../../components/Section";
import Weather from "../../components/Weather";

import css from "./Overview.module.css";

const Overview = ({ data, lat, lon, mode, onSelectMode }) => {
  return (
    <div className={css.overview}>
      <Weather className={css.weather} lat={lat} lon={lon} />
      <BarChart className={css.data} data={data} />
      <LineChart
        className={css.graph}
        data={data}
        mode={mode}
        onSelectMode={onSelectMode}
      />
    </div>
  );
};

export default Overview;
export { Overview };
