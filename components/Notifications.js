import React, { useRef } from "react";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import { typeToLabel } from "../util/eventTypes";

import css from "./Notifications.module.css";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    pointerEvents: "auto",
    padding: theme.spacing(1),
  },
}));

function Notifications({ onSelect, recent }) {
  const classes = useStyles();
  const state = useRef({ timer: null });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handlePopoverEnter = () => {
    clearTimeout(state.current.timer);
    setOpen(true);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    handlePopoverEnter();
  };

  const handlePopoverClose = (ev) => {
    state.current.timer = setTimeout(() => {
      setOpen(false);
    }, 500);
  };

  return (
    <div>
      <div
        className={css.notification}
        aria-owns={open ? "event-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {recent.length ? (
          <div className={css.badge}>{recent.length}</div>
        ) : null}
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onMouseEnter={handlePopoverEnter}
        onMouseLeave={handlePopoverClose}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {recent.length
          ? recent.map((item) => (
              <div
                key={item._id}
                style={{ margin: 16, width: 200 }}
                onClick={() => {
                  setOpen(false);
                  onSelect(item);
                }}
              >
                New {typeToLabel(item.eventType)}
              </div>
            ))
          : "No new incidents"}
      </Popover>
    </div>
  );
}

export default Notifications;
