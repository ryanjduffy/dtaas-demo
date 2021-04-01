import classnames from "classnames/bind";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryTheme,
} from "victory";

import Section from "../components/Section";
import typeToLabel from "../util/eventTypes";

import useChartResize from "./useChartResize.ts";

import css from "./BarChart.module.css";
const cx = classnames.bind(css);

const barStyle = {
  labels: {
    fill: "var(--text-secondary)",
  },
};

// Always use the final value for the bar label
const formatLabel = (value) => () => value;

function TypeChart({ group, max }) {
  const { ref: wrapperRef, aspectRatio } = useChartResize(500, 50);

  return (
    <div ref={wrapperRef}>
      <VictoryChart
        theme={VictoryTheme.material}
        height={1}
        width={aspectRatio}
        padding={{ right: 48 }}
        domain={[0, max]}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryGroup
          horizontal
          offset={10}
          style={{ data: { width: 3 } }}
          colorScale={["#fe012e", "#ff9a00", "#51ff87"]}
          animate={{
            duration: 2000,
          }}
        >
          <VictoryBar
            data={[{ x: 1, y: group.closed }]}
            style={barStyle}
            labels={formatLabel(group.closed)}
          />
          <VictoryBar
            data={[
              {
                x: 1,
                y: group.inProgress,
              },
            ]}
            style={barStyle}
            labels={formatLabel(group.inProgress)}
          />
          <VictoryBar
            data={[{ x: 1, y: group.open }]}
            style={barStyle}
            labels={formatLabel(group.open)}
          />
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}

function BarChart({ className, data }) {
  const grouped = useMemo(() => {
    return data.reduce((acc, d) => {
      if (!acc[d.eventType]) {
        acc[d.eventType] = { closed: 0, inProgress: 0, open: 0 };
      }
      acc[d.eventType][d.status || "open"]++;
      return acc;
    }, {});
  }, [data]);

  const max = Object.keys(grouped).reduce(
    (acc, k) =>
      Math.max(acc, grouped[k].closed, grouped[k].inProgress, grouped[k].open),
    0
  );
  return (
    <Section className={cx(className, "barChart")} title="Event Status">
      <div className={css.container}>
        {Object.keys(grouped)
          .sort((a, b) => typeToLabel(a).localeCompare(typeToLabel(b)))
          .map((type, i) => (
            <React.Fragment key={"event-status-" + type + i}>
              <label>{typeToLabel(type)}</label>
              <TypeChart max={max} group={grouped[type]} />
            </React.Fragment>
          ))}
      </div>
    </Section>
  );
}

export default BarChart;
