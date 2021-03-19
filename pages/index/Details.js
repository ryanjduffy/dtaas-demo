import React from "react";
import { Button } from "@material-ui/core";

import Header from "../../components/Header";
import Section from "../../components/Section";

import css from "./Details.module.css";

const mapStatusToLabel = (status) => {
  const map = {
    open: "Active",
    inProgress: "In Progress",
    closed: "Closed"
  };

  return map[status] || map.open;
};

const Details = ({ selected, onClose, onNotify }) => {
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
              <td>{selected.eventType}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>???</td>
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
            justifyContent: "center"
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
