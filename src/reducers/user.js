import Action from '../constants/action';

const initialState = {
  loading: false,
  error: undefined,
  firstName: null,
  lastName: null,
  telegramId: null,
  username: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Action.USER_LOAD_START:
      return {
        ...state,
        loading: true,
      };
    case Action.USER_LOAD_SUCCESS:
      return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
        telegramId: action.telegramId,
        username: action.username,
      };
    case Action.USER_LOAD_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case Action.USER_LOAD_FINISH:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
