import {
  getAuthData,
  getAuthFailure,
  getAuthUserData,
  getAuthUserLogout,
  getLoadingState,
  getOTPFailure,
  getOTPStatus,
  getOTPStatusRefresh,
  getOtpVerified,
  getOtpVerifiedFailure,
  getOtpVerifiedRefresh,
  getRefreshUserData,
  getUserProfileData,
  getUserProfileFailure,
} from "../reducers/userSlice";
import { AppDispatch } from "../store";
import { postRequest } from "./request";

export const fetchAuthLoginData =
  (body: Record<string, any>) => async (dispatch: AppDispatch) => {
    dispatch(getAuthData());
    try {
      const res = await postRequest("login", body, false);
      dispatch(getAuthUserData(res.data));
    } catch (err: any) {
      dispatch(getAuthFailure(err));
    }
  };

export const fetchUserProfile = () => async (dispatch: AppDispatch) => {
  try {
    const res = await postRequest("user-profile", {}, true);
    dispatch(getUserProfileData(res));
  } catch (err: any) {
    dispatch(getUserProfileFailure(err));
  }
};

export const fetchAuthUserLogout = () => async (dispatch: AppDispatch) => {
  try {
    await postRequest("logout", {});
    dispatch(getRefreshUserData());
    dispatch(getAuthData());
    dispatch(getAuthUserLogout());
  } catch (err: any) {
    dispatch(getAuthFailure(err));
  }
};

export const resetState = () => async (dispatch: AppDispatch) => {
  dispatch(getLoadingState());
};

export const sendOTPToUpdateDetails =
  (body: Record<string, any>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getOTPStatusRefresh());
      const res = await postRequest("send-otp", body, true);
      dispatch(getOTPStatus(res.data));
    } catch (error: any) {
      dispatch(getOTPFailure(error));
    }
  };

export const VerifyOtp =
  (body: Record<string, any>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getOtpVerifiedRefresh());
      const res = await postRequest("verify-otp", body, true);
      console.log(res, "Verify OTP");
      if (res.success) {
        dispatch(fetchUserProfile()).then(() => {
          dispatch(getOtpVerified(res));
        });
      }
    } catch (error: any) {
      dispatch(getOtpVerifiedFailure(error));
    }
  };

export const refreshVerifyState = () => async (dispatch: AppDispatch) => {
  dispatch(getOTPStatusRefresh());
  dispatch(getOtpVerifiedRefresh());
};
