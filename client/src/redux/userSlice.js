import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    otherUsers: [],
    profile: null,
    authLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authLoading = false;
    },
    setOtherUser: (state, action) => {
      state.otherUsers = action.payload; 
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;
      state.profile = null;
      state.otherUsers = [];
      state.authLoading = false;
    },
  },
});

export const { setUser, setOtherUser, setProfile } = userSlice.actions;
export default userSlice.reducer;
