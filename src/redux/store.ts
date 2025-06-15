import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/userSlice";
import freeBetSlice from "./reducers/freeBetSlice";

export const store: any = configureStore({
  reducer: {
    authSlice: authSlice,
    freeBetSlice: freeBetSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
