import { put, call, select } from 'redux-saga/effects';

import Action from '../constants/action';
import {
  generateTronWallet,
  importTronWalletFromPrivateKey,
  generateERC20Wallet,
  importERC20WalletFromPrivateKey,
  generateBTCWallet,
  importBTCWalletFromPrivate,
  encryptKey,
  savePrKeyToLS,
} from '../utils/helper.wallet';
import { cryptoType } from '../constants/cryptoType';
import fetchHandler from '../utils/helper.fetch';

const createWallet = async ({ address, name, type, token }) => {
  const body = {
    address: address,
    type: type,
    name: name || '',
  };

  const { wallet } = await fetchHandler({ url: '/api/wallet/create', method: 'POST', body, token });
  return { wallet };
};

const saveToLS = (address, privateKey) => savePrKeyToLS({ address, privateKey });

const getWallets = async (token) => {
  try {
    const { wallets } = await fetchHandler({ url: '/api/wallet/list', token });
    return { wallets };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const generateWallet = async (type) => {
  let data = undefined;

  switch (type) {
    case cryptoType.ERC20.value:
      data = await generateERC20Wallet();
      break;
    case cryptoType.BTC.value:
      data = await generateBTCWallet();
      break;
    case cryptoType.TRON.value:
    default:
      data = await generateTronWallet();
  }
  const { address, privateKey } = data;
  // encrypt private key
  const encryptedPrivateKey = await encryptKey({ key: privateKey, data: address });
  return { address, privateKey: encryptedPrivateKey };
};

const activateWallet = async (address, privateKey, type, name, token) => {
  const saveAddressToDB = async ({ address, type, name, token }) => {
    try {
      const { wallet: createdWallet } = await createWallet({ address, name, type, token });
      const { wallet: activatedWallet } = await fetchHandler({ url: `/api/wallet/activate/${createdWallet._id}`, method: 'PUT', token });
      return { activatedWallet };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  await savePrKeyToLS({ address, privateKey });
  const { activatedWallet } = await saveAddressToDB({ address, type, name, token });

  return { activatedWallet };
};

const findWallet = async (address, token) => {
  const { wallet } = await fetchHandler({ url: `/api/wallet/find/${address}`, token });
  return { wallet };
};

const importWallet = async (type, prKey) => {
  let importedData = undefined;

  switch (type) {
    case cryptoType.ERC20.value:
      importedData = await importERC20WalletFromPrivateKey({ privateKey: prKey, withValidation: true });
      break;
    case cryptoType.BTC.value:
      importedData = await importBTCWalletFromPrivate({ privateKey: prKey, withValidation: true });
      break;
    case cryptoType.TRON.value:
    default:
      importedData = await importTronWalletFromPrivateKey({ privateKey: prKey, withValidation: true });
  }

  const { address, privateKey, isValid, error } = importedData;

  if (!isValid) return { isValid, error };

  // encrypt private key
  const encryptedPrivateKey = await encryptKey({ key: privateKey, data: address });
  return { address, privateKey: encryptedPrivateKey };
};

const checkWalletActivation = async (address, token) => {
  try {
    // const { isActivated } = await fetchHandler({ url: `/api/wallet/check/${address}`, token });
    const isActivated = false;

    return { isActivated };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export function* getWalletsSaga(action) {
  try {
    const { token } = yield select(state => state.app);

    if (!action.background) {
      yield put({ type: Action.WALLET_LIST_START });
    }

    const { wallets } = yield call(getWallets, token);
    yield put({ type: Action.WALLET_LIST_SUCCESS, wallets });
  } catch (e) {
    console.error(e);
    yield put({ type: Action.WALLET_LIST_ERROR, error: e });
  } finally {
    if (!action.background) {
      yield put({ type: Action.WALLET_LIST_FINISH });
    }
  }
}

export function* generateWalletSaga(action) {
  try {
    yield put({ type: Action.WALLET_NEW_GENERATION_START });
    const { type } = yield select(state => state.wallet.new);

    if (!type) throw new Error('Something went wrong during wallet generation, type is not existed');
    const { address, privateKey } = yield call(generateWallet, type);
    yield put({ type: Action.WALLET_NEW_GENERATION_SUCCESS, address, privateKey });
    action.successCallback();
  } catch (e) {
    console.error(e);
    yield put({ type: Action.WALLET_NEW_GENERATION_ERROR, error: e });
    action.errorCallback();
  } finally {
    yield put({ type: Action.WALLET_NEW_GENERATION_FINISH });
  }
}

export function* activateWalletSaga(action) {
  try {
    yield put({ type: Action.WALLET_NEW_ACTIVATION_START });
    const { token } = yield select(state => state.app);
    const { address, privateKey, type, name } = yield select(state => state.wallet.new);

    if (!privateKey) {
      action.errorCallback();
      throw new Error('Something went wrong during wallet activation');
    }

    const { activatedWallet } = yield call(activateWallet, address, privateKey, type, name, token);
    yield put({
      type: Action.WALLET_NEW_ACTIVATION_SUCCESS,
      wallet: { ...activatedWallet, privateKey },
      isActivated: activatedWallet.isActivated,
    });
    action.successCallback();
    yield put({ type: Action.WALLET_LIST, background: true });
  } catch (e) {
    console.error(e);
    yield put({ type: Action.WALLET_NEW_ACTIVATION_ERROR, error: e });
    action.errorCallback();
  }
}

export function* importWalletSaga(action) {
  const { prKey } = action;
  const { type } = yield select(state => state.wallet.new);

  // return encrypted private key
  const { address, privateKey, isValid, error } = yield call(importWallet, type, prKey);

  if (!isValid) {
    yield put({ type: Action.WALLET_IMPORT_RESULT, error });
    return;
  }

  yield put({ type: Action.WALLET_IMPORT_RESULT, address, privateKey });
}

export function* checkImportedWalletSaga(action) {
  try {
    yield put({ type: Action.WALLET_CHECK_IMPORTED_START });
    const { token } = yield select(state => state.app);
    const { type, address, privateKey } = yield select(state => state.wallet.new);
    const prKey = action.privateKey;
    if (!type || !prKey) throw new Error('Something went wrong during wallet generation, type is not existed');

    const { isActivated } = yield call(checkWalletActivation, address, token);
    yield put({ type: Action.WALLET_CHECK_IMPORTED_SUCCESS, isActivated });

    if (isActivated) {
      // save to LS
      yield call(saveToLS, address, privateKey);
      // check if wallet existed in DB. If no - create new wallet with 'type', 'address', but without 'name' fields;
      const { wallet } = yield call(findWallet, address, token);
      if (!wallet) {
        const { wallet } = yield call(createWallet, { address, type, token });
      }
    }

    action.successCallback({ isActivated, address });
    yield put({ type: Action.WALLET_LIST, background: true });
  } catch (e) {
    console.error(e);
    yield put({ type: Action.WALLET_CHECK_IMPORTED_ERROR, error: e });
    action.errorCallback();
  } finally {
    yield put({ type: Action.WALLET_CHECK_IMPORTED_FINISH })
  }
}
