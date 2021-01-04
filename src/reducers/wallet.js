import Action from '../constants/action';
import {act} from '@testing-library/react';

const initialState = {
  loading: false,
  error: undefined,
  new: {
    isGenerated: false,
    isActivated: false,
    name: '',
    type: '',
    address: '',
    privateKey: '',
    loading: false,
    error: undefined,
  },
  wallets: {
    tron: [],
    erc20: [],
    btc: [],
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // wallets
    case Action.WALLET_LIST_START:
      return {
        ...state,
        loading: true,
      };
    case Action.WALLET_LIST_SUCCESS:
      return {
        ...state,
        wallets: action.wallets,
      };
    case Action.WALLET_LIST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case Action.WALLET_LIST_FINISH:
      return {
        ...state,
        loading: false,
      };
    // new wallet form
    case Action.WALLET_NEW_CHANGE_NAME:
      return {
        ...state,
        new: {
          ...state.new,
          name: action.value,
        },
      };
    case Action.WALLET_NEW_CHANGE_TYPE:
        return {
          ...state,
          new: {
            ...state.new,
            type: action.value,
          },
        };
    // new wallet generation, activation and importing
    case Action.WALLET_NEW_GENERATION_START:
    case Action.WALLET_NEW_ACTIVATION_START:
    case Action.WALLET_CHECK_IMPORTED_START:
      return {
        ...state,
        new: {
          ...state.new,
          loading: true,
        },
      }
    case Action.WALLET_NEW_GENERATION_SUCCESS:
      return {
        ...state,
        new: {
          ...state.new,
          isGenerated: true,
          address: action.address,
          privateKey: action.privateKey,
        },
      };
    case Action.WALLET_CHECK_IMPORTED_SUCCESS:
      return {
        ...state,
        new: {
          ...state.new,
          isActivated: action.isActivated,
        },
      };
    case Action.WALLET_IMPORT_RESULT:
      if (!action.isValid) {
        return {
          ...state,
          new: {
            ...state.new,
            error: action.error,
          },
        };
      }

      return {
        ...state,
        new: {
          ...state.new,
          address: action.address,
          privateKey: action.privateKey,
        },
      };
    case Action.WALLET_NEW_ACTIVATION_SUCCESS:
      return {
        ...state,
        new: {
          ...state.new,
          isActivated: action.isActivated,
          address: action.wallet.address,
          privateKey: action.wallet.privateKey,
          name: action.wallet.name,
        },
      };
    case Action.WALLET_NEW_GENERATION_ERROR:
    case Action.WALLET_NEW_ACTIVATION_ERROR:
    case Action.WALLET_CHECK_IMPORTED_ERROR:
      return {
        ...state,
        new: {
          ...state.new,
          error: action.error,
        },
      };
    case Action.WALLET_NEW_GENERATION_FINISH:
    case Action.WALLET_NEW_ACTIVATION_FINISH:
    case Action.WALLET_CHECK_IMPORTED_FINISH:
      return {
        ...state,
        new: {
          ...state.new,
          loading: false,
        },
      };
    case Action.WALLET_NEW_PREPARE:
      return {
        ...state,
        new: {
          ...initialState.new,
        },
      };
    default:
      return state;
  }
};

export default reducer;
