import React from "react";
import {
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ placeholder, value, onChange }) => (
  <Paper
    component="form"
    sx={{
      display: "flex",
      alignItems: "center",
      padding: "4px 10px",
      flexGrow: 1,
      borderRadius: 3,
      boxShadow: 2,
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder={placeholder}
      inputProps={{ "aria-label": placeholder }}
      value={value}
      onChange={onChange}
    />
    <IconButton type="button" sx={{ p: "10px" }}>
      <SearchIcon />
    </IconButton>
  </Paper>
);

export default SearchField;