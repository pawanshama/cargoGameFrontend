import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userDetails: string | null;
  isAuthenticated: boolean;
  hasError: boolean;
  errorMsg: string;
  loading: boolean;
  otpSent: boolean;
  otpHasError: boolean;
  otpErrorMsg: string;
  otpVerified: boolean;
  otpVerifiedError: boolean;
  otpVerifiedMsg: string;
  useDetailsStatus: boolean;
  userDetailsFailure: string;
}

const getInitialStateFromStorage = (): AuthState => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("userDetails");
    return {
      loading: false,
      isAuthenticated: !!storedToken,
      token: storedToken,
      refreshToken: storedRefreshToken,
      userDetails: storedUser ?? null,
      hasError: false,
      errorMsg: "",
      otpSent: false,
      otpHasError: false,
      otpErrorMsg: "",
      otpVerified: false,
      otpVerifiedError: false,
      otpVerifiedMsg: "",
      useDetailsStatus: false,
      userDetailsFailure: "",
    };
  }
  return {
    loading: false,
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    userDetails: null,
    hasError: false,
    errorMsg: "",
    otpSent: false,
    otpHasError: false,
    otpErrorMsg: "",
    otpVerified: false,
    otpVerifiedError: false,
    otpVerifiedMsg: "",
    useDetailsStatus: false,
    userDetailsFailure: "",
  };
};

const initialState: AuthState = getInitialStateFromStorage();

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    getLoadingState: (state) => {
      state.hasError = false;
      state.errorMsg = "";
      state.loading = true;
    },
    getAuthData: (state) => {
      state.loading = true;
      state.hasError = false;
    },
    getRefreshUserData: (state) => {
      state.loading = false;
      state.hasError = false;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.userDetails = null;
    },
    getAuthFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.hasError = true;
      state.isAuthenticated = false;
      state.errorMsg = action.payload?.error || "Unknown error";
    },
    getAuthUserData: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        userData: string;
      }>
    ) => {
      console.log("action", action.payload.userData);
      state.loading = false;
      state.hasError = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.userDetails = JSON.stringify(action.payload.userData);
      state.isAuthenticated = true;
    },
    getUserProfileData: (
      state,
      action: PayloadAction<{
        data: string;
      }>
    ) => {
      console.log("profile action, slice", action.payload);
      state.useDetailsStatus = true;
      state.userDetails = JSON.stringify(action.payload.data);
    },
    getUserProfileFailure: (state) => {
      state.userDetailsFailure = "Failed to fetch";
    },
    getAuthUserLogout: (state) => {
      state.userDetails = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.errorMsg = "";
    },
    getOTPStatusRefresh: (state) => {
      state.otpSent = false;
      state.otpErrorMsg = "";
    },
    getOTPStatus: (state) => {
      state.otpSent = true;
      state.otpErrorMsg = "";
    },
    getOTPFailure: (state, action: PayloadAction<any>) => {
      state.otpSent = false;
      state.otpErrorMsg =
        action.payload?.response?.data?.message ||
        "Invalid response from server";
      state.otpHasError = true;
    },
    getOtpVerifiedRefresh: (state) => {
      state.otpVerified = false;
      state.otpVerifiedError = false;
      state.otpVerifiedMsg = "";
    },
    getOtpVerified: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.otpVerified = action.payload.success;
      state.otpVerifiedError = !action.payload.success;
      state.otpVerifiedMsg = action.payload.message;
    },
    getOtpVerifiedFailure: (state, action: PayloadAction<any>) => {
      state.otpVerified = action.payload.success;
      state.otpVerifiedError = !action.payload.success;
      state.otpVerifiedMsg = action.payload.message;
    },
  },
});

export const {
  getLoadingState,
  getAuthData,
  getAuthFailure,
  getAuthUserData,
  getAuthUserLogout,
  getRefreshUserData,
  getOTPStatusRefresh,
  getOTPStatus,
  getOTPFailure,
  getUserProfileData,
  getUserProfileFailure,
  getOtpVerifiedRefresh,
  getOtpVerified,
  getOtpVerifiedFailure,
} = authSlice.actions;

export const authDataSelector = (state: RootState) => state.authSlice;
export default authSlice.reducer;
