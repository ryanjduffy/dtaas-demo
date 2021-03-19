/// app.js
import geohash from "ngeohash";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Map, { withTransition } from "../components/Map";
import Notifications from "../components/Notifications";
import useElasticSearch from "../components/useElasticSearch";
import useNotifications from "../components/useNotifications";
import * as time from "../util/time";

import Details from "./index/Details";
import Overview from "./index/Overview";
import css from "./index/index.module.css";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.4014263440238,
  latitude: 37.78800921252298,
  zoom: 14,
  pitch: 0,
  bearing: 0
};

function App() {
  const [mode, setMode] = useState("month");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selected, setSelected] = useState();
  const [zoom, setZoom] = useState(INITIAL_VIEW_STATE.zoom);
  const [data, setData] = useState();
  const [agg, setAgg] = useState();
  const [viewState, setViewState] = useState(
    withTransition(INITIAL_VIEW_STATE)
  );

  const { fetchData, fetchAggregate, update } = useElasticSearch({});
  const handleNewData = useCallback(
    (d) => setData((current) => [...current, ...d]),
    [setData]
  );
  const [recent, setRecent] = useNotifications({ onNewItems: handleNewData });

  const handleNotify = useCallback(() => {
    if (!selected) return;

    const updated = { ...selected, status: "inProgress" };
    update(updated).then(() => {
      setData((current) => {
        const i = current.findIndex((d) => d._id === updated._id);
        if (i !== -1) {
          return [...current.slice(0, i), updated, ...current.slice(i + 1)];
        }
      });
      setSelected(updated);
    });
  }, [selected, setData, setSelected, update]);

  const handleSelectNotification = useCallback(
    (entry) => {
      setSelected(entry);
      setRecent([]);
    },
    [setSelected, setRecent]
  );

  const handleZoom = useMemo(() => {
    let timer;

    return (zoom) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = null;
        setZoom(zoom);
      }, 100);
    };
  }, [setZoom]);

  const timeFilter = useMemo(() => {
    let ts = 0;
    if (mode === "day") {
      ts = time.today();
    } else if (mode === "week") {
      ts = time.week();
    } else if (mode === "month") {
      ts = time.month();
    } else if (mode === "quarter") {
      ts = time.quarter();
    }

    return { range: { ts: { gt: ts } } };
  }, [mode]);

  useEffect(() => {
    fetchData([timeFilter]).then(setData);
  }, [fetchData, timeFilter, setData]);

  useEffect(() => {
    fetchAggregate(Math.round((zoom * 12) / 30) + 1, timeFilter)
      .then((buckets) => {
        return buckets.map(({ key, doc_count }) => {
          const [minLat, minLon, maxLat, maxLon] = geohash.decode_bbox(key);

          return {
            count: doc_count,
            coordinates: [
              (maxLon - minLon) / 2 + minLon,
              (maxLat - minLat) / 2 + minLat
            ]
          };
        });
      })
      .then(setAgg);
  }, [fetchAggregate, timeFilter, zoom]);

  const toggle = useCallback(
    (type) => {
      if (Array.isArray(type)) {
        setSelectedTypes(type);
      } else {
        setSelectedTypes((current) => {
          if (current.includes(type)) {
            return current.filter((c) => c !== type);
          } else {
            return [...current, type];
          }
        });
      }
    },
    [setSelectedTypes]
  );
  const types = useMemo(() => {
    return (
      data &&
      data.reduce((acc, v) => {
        acc[v.eventType] = acc[v.eventType] || { type: v.eventType, count: 0 };
        acc[v.eventType].count += 1;

        return acc;
      }, {})
    );
  }, [data]);

  const mapData = useMemo(() => {
    if (selectedTypes.length === 0) {
      return data;
    }

    return data && data.filter((d) => selectedTypes.includes(d.eventType));
  }, [data, selectedTypes]);

  useEffect(() => {
    if (!selected) {
      setViewState((current) =>
        withTransition({
          ...current,
          ...INITIAL_VIEW_STATE
        })
      );
    }
  }, [selected, setViewState]);

  if (!data) {
    return null;
  }

  return (
    <div className={css.layout}>
      <header className={css.header}>
        <h2>San Francisco</h2>
        <div style={{ flex: 1 }} />
        <Notifications recent={recent} onSelect={handleSelectNotification} />
        <img
          src="https://i.pravatar.cc/32?img=16"
          alt="avatar"
          className={css.avatar}
        />
      </header>
      <Map
        className={css.map}
        viewState={viewState}
        setViewState={setViewState}
        aggregate={selected ? undefined : agg}
        data={mapData}
        onSelect={setSelected}
        onZoom={handleZoom}
        selected={selected}
        types={types}
        selectedTypes={selectedTypes}
        onSelectType={toggle}
      />
      {selected ? (
        <Details
          selected={selected}
          onClose={() => setSelected(undefined)}
          onNotify={handleNotify}
        />
      ) : (
        <Overview
          data={data}
          lat={INITIAL_VIEW_STATE.latitude}
          lon={INITIAL_VIEW_STATE.longitude}
          mode={mode}
          onSelectMode={setMode}
        />
      )}
    </div>
  );
}

export default App;