import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearSearch: (state) => {
      state.search = "";
    },
  },
});

export const { setSearch, clearSearch } = uiSlice.actions;
export default uiSlice.reducer;
