const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  appointments: [],
};

const DataSlice = createSlice({
  name: "DataSlice",
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
});
export const { setPros } = DataSlice.actions;
export default DataSlice.reducer;
