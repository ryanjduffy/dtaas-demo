import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import React from "react";

import typeToLabel from "../util/eventTypes";

import css from "./DataGrid.module.css";

const Grid = ({ data, onSelect, selected }) => {
  const rows = Object.keys(data).sort((a, b) =>
    typeToLabel(a).localeCompare(typeToLabel(b))
  );
  return (
    <Autocomplete
      className={css.datagrid}
      id="combo-box-demo"
      options={rows}
      getOptionLabel={(option) => typeToLabel(option)}
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
