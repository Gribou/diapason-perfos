import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import api from "./api";

const initialState = { message: "" };

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    displayMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.contact.matchFulfilled, (state) => {
      state.message = "Formulaire transmis à l'administrateur.";
    });
  },
});

export const { displayMessage, clearMessage } = messagesSlice.actions;

export default messagesSlice.reducer;

export const useMessage = () =>
  useSelector((state) => state?.messages?.message);
