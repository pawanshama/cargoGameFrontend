import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface FreeBetState {
  hasError: boolean;
  errorMsg: string;
  freeBetData: string | null;
}

const getInitialStateFromStorage = (): FreeBetState => {
  return {
    hasError: false,
    errorMsg: "",
    freeBetData: null,
  };
};

const initialState: FreeBetState = getInitialStateFromStorage();

const freeBetSlice = createSlice({
  name: "freeBetSlice",
  initialState,
  reducers: {
    getRefreshState: (state) => {
      state.hasError = false;
      state.freeBetData = "";
      state.freeBetData = null;
    },
    getFreeBetData: (
      state,
      action: PayloadAction<{
        data: string;
      }>
    ) => {
      state.hasError = false;
      state.freeBetData = JSON.stringify(action.payload?.data);
    },
    getFreeBetFailure: (state, action: PayloadAction<any>) => {
      state.hasError = true;
      state.freeBetData = "";
      state.freeBetData = action.payload?.message;
    },
  },
});

export const { getRefreshState, getFreeBetData, getFreeBetFailure } =
  freeBetSlice.actions;
export const freeBetDataSelector = (state: RootState) => state.freeBetSlice;
export default freeBetSlice.reducer;
