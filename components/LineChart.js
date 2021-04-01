import classnames from "classnames/bind";
import { format } from "date-fns";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryTheme,
} from "victory";

import Section from "./Section";

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
      return [today - 89, today];
    } else if (mode === "month") {
      return [today - 30, today];
    } else if (mode === "week") {
      return [today - 6, today];
    } else if (mode === "day") {
      return [0, 24];
    }
  }, [mode]);

  const tickCount = useMemo(() => {
    if (mode === "quarter") {
      return 6;
    } else if (mode === "month") {
      return 4;
    } else if (mode === "week") {
      return 7;
    } else if (mode === "day") {
      return 8;
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
    <Section
      title="Event History"
      className={cx(className, "chart")}
      actions={
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
      }
    >
      <div className={css.wrapper}>
        <VictoryChart
          width={800}
          heigh={300}
          padding={{ top: 24, left: 48, right: 24, bottom: 48 }}
          theme={VictoryTheme.material}
          animate={{ duration: 1000 }}
          domain={{ x: domain }}
          tickCount={tickCount}
        >
          <VictoryAxis
            tickFormat={(d) => {
              const dt = new Date(new Date().getFullYear(), 0, d);
              if (mode === "day") {
                dt.setHours(d);
                return format(dt, "h aa");
              } else if (mode === "week") {
                return format(dt, "MM/dd eeee").split(" ").join("\n");
              }
              return format(dt, "MMM dd");
            }}
            style={{
              grid: { stroke: "transparent" },
              tickLabels: {
                fill: "var(--text-secondary)",
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: {
                fill: "var(--text-secondary)",
              },
            }}
          />
          <VictoryStack colorScale={["#43d3bd"]}>
            <VictoryArea data={grouped} interpolation="basis" />
          </VictoryStack>
        </VictoryChart>
      </div>
    </Section>
  );
}

export default LineChart;
