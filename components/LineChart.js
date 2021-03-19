import classnames from "classnames/bind";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryTheme
} from "victory";

import css from "./LineChart.module.css";
const cx = classnames.bind(css);

function byDate(acc, v) {
  const d = new Date(v.ts);
  const date = d.getDate() - 1;
  acc[date] = acc[date] || { x: date, y: 0 };
  acc[date].y += 1;

  return acc;
}

function byHour(acc, v) {
  const d = new Date(v.ts);
  const hour = d.getHours();
  acc[hour] = acc[hour] || { x: hour, y: 0 };
  acc[hour].y += 1;

  return acc;
}

function week(data) {
  return data.reduce(byDate, []);
}

function month(data) {
  return data.reduce(byDate, []);
}

function quarter(data) {
  return data.reduce(byDate, []);
}

function today(data) {
  return data.reduce(byHour, []);
}

function LineChart({ className, data, mode, onSelectMode }) {
  const grouped = useMemo(() => {
    if (mode === "quarter") {
      return quarter(data);
    } else if (mode === "month") {
      return month(data);
    } else if (mode === "week") {
      return week(data);
    } else if (mode === "day") {
      return today(data);
    }
  }, [data, mode]);

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
      <VictoryChart
        height={200}
        width={800}
        padding={24}
        theme={VictoryTheme.material}
        animate={{ duration: 1000 }}
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
    </div>
  );
}

export default LineChart;
