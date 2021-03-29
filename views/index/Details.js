import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";

import Header from "../../components/Header";
import Section from "../../components/Section";

import css from "./Details.module.css";
import typeToLabel from "../../util/eventTypes";
import { mapboxToken } from "../../util/geo";

const mapStatusToLabel = (status) => {
  const map = {
    open: "Active",
    inProgress: "In Progress",
    closed: "Closed",
  };

  return map[status] || map.open;
};

function useReverseGeocoding({ token, lat, lon }) {
  const [placeName, setPlaceName] = useState();
  useEffect(() => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${token}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const f = data.features[0];
        setPlaceName(f && f.place_name);
      });
  }, [lat, lon]);

  return { placeName };
}

const Details = ({ selected, onClose, onNotify }) => {
  const { placeName } = useReverseGeocoding({
    token: mapboxToken,
    ...selected.location,
  });

  return (
    <div className={css.details}>
      <Header className={css.nav}>
        <span>Event Information</span>
        <span onClick={onClose}>X</span>
      </Header>
      <div className={css.info}>
        <Header className={css.infoHeader}>Event</Header>
        <table>
          <tbody>
            <tr>
              <td>Type</td>
              <td>{typeToLabel(selected.eventType)}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>
                <pre>
                  {placeName &&
                    placeName
                      .split(",")
                      .map((s) => s.trim())
                      .join("\n")}
                </pre>
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{new Date(selected.ts).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Time</td>
              <td>{new Date(selected.ts).toLocaleTimeString()}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{mapStatusToLabel(selected.status)}</td>
            </tr>
          </tbody>
        </table>
        <div className={css.infoActions}>
          {!selected.status || selected.status === "open" ? (
            <>
              <Button
                className={css.button}
                variant="contained"
                onClick={onNotify}
              >
                Notify SMD
              </Button>
              <Button
                className={css.button}
                variant="contained"
                onClick={onNotify}
              >
                Notify SFPD
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <Section className={css.reports} title="Vehicles Report">
        <div className={css.counter}>19</div>
      </Section>
      <Section className={css.delays} title="Traffic Created">
        <div className={css.counter}>10</div>
      </Section>
      <Section className={css.visualization} title="Event Visualization">
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Image Available
        </div>
      </Section>
    </div>
  );
};

export default Details;
export { Details };
