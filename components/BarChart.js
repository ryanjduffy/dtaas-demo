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
          data={[{ x: 1, y: group.closed, label: String(group.closed) }]}
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
              y: group.inProgress,
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
          data={[{ x: 1, y: group.open, label: String(group.open) }]}
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
    return data.reduce(
      (acc, d) => {
        acc[d.eventType][d.status || "open"]++;
        return acc;
      },
      {
        accident: { closed: 0, inProgress: 0, open: 0 },
        emergency: { closed: 0, inProgress: 0, open: 0 },
        pothole: { closed: 0, inProgress: 0, open: 0 },
        bicycle: { closed: 0, inProgress: 0, open: 0 },
        construction: { closed: 0, inProgress: 0, open: 0 }
      }
    );
  }, [data]);
  const max = Math.max(
    grouped.accident.closed,
    grouped.accident.inProgress,
    grouped.accident.open,
    grouped.emergency.closed,
    grouped.emergency.inProgress,
    grouped.emergency.open,
    grouped.pothole.closed,
    grouped.pothole.inProgress,
    grouped.pothole.open,
    grouped.bicycle.closed,
    grouped.bicycle.inProgress,
    grouped.bicycle.open,
    grouped.construction.closed,
    grouped.construction.inProgress,
    grouped.construction.open
  );
  return (
    <Section className={cx(className, "barChart")} title="Event Status">
      {data.length ? (
        <div className={css.container}>
          <label>Car Accident</label>
          <TypeChart max={max} group={grouped.accident} />
          <label>Emergency Response</label>
          <TypeChart max={max} group={grouped.emergency} />
          <label>Potholes</label>
          <TypeChart max={max} group={grouped.pothole} />
          <label>Bicycles</label>
          <TypeChart max={max} group={grouped.bicycle} />
          <label>Road Construction</label>
          <TypeChart max={max} group={grouped.construction} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          }}
        >
          No events available
        </div>
      )}
    </Section>
  );
}

export default BarChart;
