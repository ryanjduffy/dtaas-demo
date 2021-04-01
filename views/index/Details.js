import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@material-ui/core";

import Header from "../../components/Header";
import Section from "../../components/Section";
import typeToLabel from "../../util/eventTypes";
import { mapboxToken } from "../../util/geo";

import Counter from "./Counter";

import css from "./Details.module.css";

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
  const delay = useMemo(() => Math.floor(Math.random() * 10), [selected._id]);
  const { placeName } = useReverseGeocoding({
    token: mapboxToken,
    ...selected.location,
  });

  return (
    <div className={css.details}>
      <Header className={css.nav} actions={<span onClick={onClose}>X</span>}>
        Event Information
      </Header>
      <Section title="Event" className={css.info}>
        <div className={css.infoBody}>
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
                        .slice(0, 2)
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
      </Section>
      <Counter
        className={css.reports}
        title="Vehicles Report"
        count={19}
        label="Vehicles reported this hazard"
      />
      <Counter
        className={css.delays}
        title="Traffic Created"
        count={delay}
        label="delay in minute"
      />
      <Section className={css.visualization} title="Event Visualization">
        {selected.eventVideoURL ? (
          <video controls className={css.video}>
            <source src={selected.eventVideoURL} />
          </video>
        ) : (
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
        )}
      </Section>
    </div>
  );
};

export default Details;
export { Details };
