import classnames from "classnames/bind";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import React, { useMemo } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryTheme
} from "victory";

import css from "./LineChart.module.css";
const cx = classnames.bind(css);

function dayOfYear(date) {
  return (
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000
  );
}

function byDate(acc, v) {
  const d = new Date(v.ts);
  const day = dayOfYear(d);
  const entry = acc.find((v) => v.x === day);
  if (entry) {
    entry.y += 1;
  }

  return acc;
}

function byHour(acc, v) {
  const d = new Date(v.ts);
  const hour = d.getHours();
  acc[hour] = acc[hour] || { x: hour, y: 0 };
  acc[hour].y += 1;

  return acc;
}

function LineChart({ className, data, mode, onSelectMode }) {
  const domain = useMemo(() => {
    const now = new Date();
    const today = dayOfYear(now);
    if (mode === "quarter") {
      return [today - 90, today];
    } else if (mode === "month") {
      return [today - 31, today];
    } else if (mode === "week") {
      return [today - 7, today];
    } else if (mode === "day") {
      return [0, 24];
    }
  }, [mode]);

  const grouped = useMemo(() => {
    const initial = Array.from(
      { length: domain[1] - domain[0] + 1 },
      (_, i) => {
        return { x: domain[0] + i, y: 0 };
      }
    );

    if (mode === "day") {
      return data.reduce(byHour, initial);
    }

    return data.reduce(byDate, initial);
  }, [data, domain, mode]);

  return (
    <div className={cx(className, "chart")}>
      <FormControl variant="outlined">
        <Select
          value={mode}
          onChange={(ev) => onSelectMode(ev.target.value)}
          placeholder="Timeframe"
        >
          <MenuItem value="day">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="quarter">This Quarter</MenuItem>
        </Select>
      </FormControl>
      {grouped.length ? (
        <VictoryChart
          key={mode}
          height={200}
          width={800}
          padding={24}
          theme={VictoryTheme.material}
          animate={{ duration: 1000 }}
          domain={{ x: domain }}
        >
          <VictoryAxis
            style={{
              grid: { stroke: "transparent" },
              tickLabels: {
                fill: "var(--text-secondary)"
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: {
                fill: "var(--text-secondary)"
              }
            }}
          />
          <VictoryStack colorScale={["#43d3bd"]}>
            <VictoryArea data={grouped} interpolation="basis" />
          </VictoryStack>
        </VictoryChart>
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
    </div>
  );
}

export default LineChart;
