import {
  APPLOADING,
  LOGOUT,
  SET_USER,
  UPDATE_USER,
  isLOGGED_IN,
  ALL_RESERVATION,
  SET_TOKEN,
  SET_CALL_DATA,
} from "../Actions/ActionType";

const initialState = {
  user: null,
  pros: [],
  appLoading: false,
  favourites: [],
  firebaseToken: null,
  callIsComing: null,
};
const Reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_USER:
      return {
        ...state,
        user: payload,
      };
    case SET_CALL_DATA:
      return {
        ...state,
        callIsComing: payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        firebaseToken: payload,
      };
    case isLOGGED_IN:
      return {
        ...state,
        isLoggedIn: payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: payload,
      };

    case LOGOUT:
      return {
        ...state,
        user: payload,
      };

    case ALL_RESERVATION:
      return {
        ...state,
        reservations: payload,
      };

    case APPLOADING:
      return {
        ...state,
        appLoading: payload,
      };
    default:
      return state;
  }
};
export default Reducer;
