import {
  getFreeBetData,
  getFreeBetFailure,
  getRefreshState,
} from "../reducers/freeBetSlice";
import { AppDispatch } from "../store";
import { postRequest } from "./request";

export const fetchFreeBetUserStatus = () => async (dispatch: AppDispatch) => {
  dispatch(getRefreshState());
  try {
    const res = await postRequest("free-bet-status", {}, true);
    dispatch(getFreeBetData(res));
  } catch (err: any) {
    dispatch(getFreeBetFailure(err));
  }
};

export const fetchFreeBetUpdateUserStatus =
  (freeBetId: string) => async (dispatch: AppDispatch) => {
    dispatch(getRefreshState());
    try {
      const res = await postRequest(
        "update-free-bet-status",
        { free_bet_id: freeBetId },
        true
      );
      dispatch(getFreeBetData(res));
    } catch (err: any) {
      dispatch(getFreeBetFailure(err));
    }
  };
