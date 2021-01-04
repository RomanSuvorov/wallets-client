import Action from '../constants/action';
import { tabs } from '../constants/tabs';

const initialState = {
  loading: true,
  checkingExistedUser: false,
  error: undefined,

  isAuthenticated: false,
  token: null,
  status: null,
  sessionID: undefined,

  activeTab: tabs[0],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Action.CHECK_SERVER_START:
      return {
        ...state,
        loading: true,
      };
    case Action.CHECK_SERVER_SUCCESS:
      return {
        ...state,
        status: action.status,
        sessionID: action.sessionID,
      };
    case Action.CHECK_SERVER_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case Action.CHECK_SERVER_FINISH:
      return {
        ...state,
        loading: false,
      };
    case Action.START_CHECK_EXISTED_USER:
      return {
        ...state,
        checkingExistedUser: true,
      };
    case Action.FINISH_CHECK_EXISTED_USER:
      return {
        ...state,
        checkingExistedUser: false,
      };
    // logIn and logOut
    case Action.FORCE_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case Action.APP_AUTHENTICATED:
      return {
        ...state,
        token: action.token,
        isAuthenticated: !!action.token,
      };
      // change active tab
    case Action.CHANGE_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.tab,
      };
    default:
      return state;
  }
};

export default reducer;
