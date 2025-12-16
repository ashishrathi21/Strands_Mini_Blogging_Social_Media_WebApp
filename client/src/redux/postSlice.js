import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    forYou: [],
    following: [],
    myPosts: [],
    loading: false,
  },
  reducers: {
    setForYouPosts: (state, action) => {
      state.forYou = action.payload;
    },
    setFollowingPosts: (state, action) => {
      state.following = action.payload;
    },
    setMyPosts: (state, action) => {
      state.myPosts = action.payload;
    },
    removeMyPost: (state, action) => {
      state.myPosts = state.myPosts.filter(
        (post) => post._id !== action.payload
      );
    },

    setPostLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setForYouPosts,
  setFollowingPosts,
  setPostLoading,
  setMyPosts,
  removeMyPost,
} = postSlice.actions;

export default postSlice.reducer;
