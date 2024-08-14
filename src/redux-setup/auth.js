const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: [],
  isLoggedIn: false,
};

const Auth = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});
export const { setUserData, setIsLoggedIn } = Auth.actions;
export default Auth.reducer;
