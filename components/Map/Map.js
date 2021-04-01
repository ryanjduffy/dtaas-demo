/// app.js
import classnames from "classnames/bind";
import { FlyToInterpolator } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import React, { useEffect, useMemo } from "react";
import { StaticMap } from "react-map-gl";

import Header from "../Header.js";
import DataGrid from "../DataGrid.js";

import { mapboxToken } from "../../util/geo";

import MapPin, { TooltipProvider } from "./MapPin";

import css from "./Map.module.css";
const cx = classnames.bind(css);

/*
// local data
copy(JSON.stringify(Array.from({length: 50}, (_, i) => {
    return {
        "type": ["pothole", "emergency", "accident", "bicycle", "construction"][Math.floor(Math.random() * 5)],
        "ts": Date.now() + Math.floor(Math.random() * 100 * i),
        "lon": -122.41669 + (Math.random() - 0.5) * 0.05,
        "lat": 37.7853 + (Math.random() - 0.5) * 0.05
    }
}), undefined, 2))

// bulk import
copy(Array.from({length: 50}).flatMap((_, i) => {
    return [
		JSON.stringify({ "index" : { "_index" : "dt-events", "_id" : i } }),
		JSON.stringify({
			"eventType": ["pothole", "emergency", "accident", "bicycle", "construction"][Math.floor(Math.random() * 5)],
			"ts": Math.round(Date.now() + Math.floor(Math.random() * 1000 * i)),
			location: {
				"lon": -122.41669 + (Math.random() - 0.5) * 0.05,
				"lat": 37.7853 + (Math.random() - 0.5) * 0.05
			}
    	})
	]
}).join('\n') + "\n")
*/

function renderPoints(points, selected, onSelect) {
  return ({ viewport }) => {
    // calculate render bounds as 10% larger than the viewport to filter renderable pins
    const bounds = viewport.getBounds();
    const dx = (bounds[2] - bounds[0]) * 0.1;
    const dy = (bounds[3] - bounds[1]) * 0.1;
    const renderBounds = [
      bounds[0] - dx,
      bounds[1] - dy,
      bounds[2] + dx,
      bounds[3] + dy,
    ];

    return (
      <>
        {points
          .map((p, i) => {
            if (!p) return null;
            const { lat, lon } = p.location;
            const [left, top] = viewport.project([lon, lat]);

            if (
              lon < renderBounds[0] ||
              lat < renderBounds[1] ||
              lon > renderBounds[2] ||
              lat > renderBounds[3]
            ) {
              return null;
            }

            const pin = (
              <MapPin
                key={i}
                style={{ left, top }}
                point={p}
                onSelect={onSelect}
                selected={selected === p}
              />
            );

            return pin;
          })
          .filter(Boolean)}
      </>
    );
  };
}

function withTransition(viewState) {
  return {
    ...viewState,
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
  };
}

function Map({
  className,
  aggregate,
  onZoom,
  viewState,
  setViewState,
  data = [],
  onSelect,
  selected,
  types,
  selectedTypes,
  onSelectType,
}) {
  const handleSelect = (entry) => {
    if (onSelect) onSelect(entry);
  };

  useEffect(() => {
    if (selected) {
      setViewState((current) =>
        withTransition({
          ...current,
          latitude: selected.location.lat,
          longitude: selected.location.lon,
          zoom: 17,
        })
      );
    }
  }, [selected, setViewState]);

  const scatter = useMemo(() => {
    return (
      aggregate &&
      new ScatterplotLayer({
        id: "ScatterplotLayer",
        data: aggregate,

        /* props from ScatterplotLayer class */

        // filled: true,
        getFillColor: [255, 140, 0],
        getLineColor: [0, 0, 0],
        // getLineWidth: 1,
        getPosition: (d) => d.coordinates,
        getRadius: (d) => Math.pow(2, d.count / 10) * 5,
        // lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
        lineWidthMinPixels: 1,
        // lineWidthScale: 1,
        // lineWidthUnits: 'meters',
        radiusMaxPixels: 100,
        radiusMinPixels: 1,
        radiusScale: 6,
        // radiusUnits: 'meters',
        // stroked: true,

        /* props inherited from Layer class */

        // autoHighlight: false,
        // coordinateOrigin: [0, 0, 0],
        // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        // highlightColor: [0, 0, 128, 128],
        // modelMatrix: null,
        opacity: 0.6,
        // visible: true,
        // wrapLongitude: false,
      })
    );
  }, [aggregate]);

  return (
    <div className={cx("map", className)}>
      <Header className={css.mapHeader}>Map</Header>
      <div className={css.mapContainer}>
        <TooltipProvider>
          <DeckGL
            initialViewState={viewState}
            controller={true}
            layers={[scatter]}
            onViewStateChange={({ viewState }) => onZoom(viewState.zoom)}
          >
            {renderPoints(data, selected, handleSelect)}
            <StaticMap
              mapboxApiAccessToken={mapboxToken}
              mapOptions={{
                style: "mapbox://styles/ryanjduffy/ckmb3y3qk5sxg17s3ypkuz41i",
              }}
            />
          </DeckGL>
        </TooltipProvider>
        <div className={cx({ select: true, hasSelected: Boolean(selected) })}>
          <DataGrid
            data={types}
            selected={selectedTypes}
            onSelect={onSelectType}
          />
        </div>
      </div>
    </div>
  );
}

export default Map;
export { withTransition };
