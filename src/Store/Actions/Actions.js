import {
  ALL_RESERVATION,
  APPLOADING,
  isLOGGED_IN,
  SET_CALL_DATA,
  SET_TOKEN,
  SET_USER,
  UPDATE_USER,
} from "./ActionType";

export const setUser = (payload) => async (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: payload,
  });
};

export const setCallData = (payload) => async (dispatch) => {
  dispatch({
    type: SET_CALL_DATA,
    payload: payload,
  });
};

export const setFirebaseToken = (payload) => async (dispatch) => {
  dispatch({
    type: SET_TOKEN,
    payload: payload,
  });
};
export const setIsLoggedIn = (payload) => async (dispatch) => {
  dispatch({
    type: isLOGGED_IN,
    payload: payload,
  });
};

export const updateUser = (payload) => async (dispatch) => {
  dispatch({
    type: UPDATE_USER,
    payload: payload,
  });
};
export const setAppLoading = (payload) => async (dispatch) => {
  dispatch({
    type: APPLOADING,
    payload: payload,
  });
};

export const setAllReasevation = (payload) => async (dispatch) => {
  dispatch({
    type: ALL_RESERVATION,
    payload: payload,
  });
};
