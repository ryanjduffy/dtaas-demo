import classnames from "classnames/bind";
import React, { useMemo } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryTheme
} from "victory";

import Section from "../components/Section";
import typeToLabel from "../util/eventTypes";

import css from "./BarChart.module.css";
const cx = classnames.bind(css);

function TypeChart({ group, max }) {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      height={10}
      width={1000}
      padding={{ right: 48 }}
      domain={[0, max]}
    >
      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: "transparent" },
          grid: { stroke: "transparent" }
        }}
      />
      <VictoryGroup
        horizontal
        offset={10}
        style={{ data: { width: 3 } }}
        colorScale={["#fe012e", "#ff9a00", "#51ff87"]}
        animate={{
          duration: 2000
        }}
      >
        <VictoryBar
          data={[{ x: 1, y: group.closed || 0.1, label: String(group.closed) }]}
          style={{
            labels: {
              fill: "var(--text-secondary)"
            }
          }}
        />
        <VictoryBar
          data={[
            {
              x: 1,
              y: group.inProgress || 0.1,
              label: String(group.inProgress)
            }
          ]}
          style={{
            labels: {
              fill: "var(--text-secondary)"
            }
          }}
        />
        <VictoryBar
          data={[{ x: 1, y: group.open || 0.1, label: String(group.open) }]}
          style={{
            labels: {
              fill: "var(--text-secondary)"
            }
          }}
        />
      </VictoryGroup>
    </VictoryChart>
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
