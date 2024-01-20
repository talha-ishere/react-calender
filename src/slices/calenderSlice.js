import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holidays: ["New", "OLD"],
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addToHolidays: (state, action) => {
      state.holidays = action.payload;
    },
  },
});

export default calendarSlice.reducer;
export const { addToHolidays } = calendarSlice.actions;
