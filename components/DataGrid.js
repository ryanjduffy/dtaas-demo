import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import React from "react";

import css from "./DataGrid.module.css";

const mapTypeToLabel = (type) => {
  const map = {
    pothole: "Potholes",
    construction: "Road Construction",
    emergency: "Emergency Response",
    bicycle: "Bicycles",
    accident: "Car Accident"
  };

  return map[type];
};

const Grid = ({ data, onSelect, selected }) => {
  const rows = Object.keys(data);
  return (
    <Autocomplete
      className={css.datagrid}
      id="combo-box-demo"
      options={rows}
      getOptionLabel={(option) => mapTypeToLabel(option)}
      style={{ width: 300 }}
      selected={selected}
      onChange={(ev, value) => {
        onSelect(value ? [value] : rows);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Filter Events ..."
          variant="outlined"
        />
      )}
    />
  );
};

export default Grid;
export { Grid as DataGrid };
