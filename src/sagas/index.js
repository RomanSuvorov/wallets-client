import { all, takeEvery } from 'redux-saga/effects';

// server and auth
import {
  checkServerSaga,
  logoutSaga,
} from './app';

import {
  getUserSaga,
} from './user';

// io
import {
  ioSaga,
} from './io';

// wallet
import {
  getWalletsSaga,
  generateWalletSaga,
  activateWalletSaga,
  importWalletSaga,
  checkImportedWalletSaga,
} from './wallet';

import Action from '../constants/action';

export default function* watcherSaga() {
  yield all([
    // auth
    takeEvery(Action.CHECK_SERVER, checkServerSaga),
    takeEvery(Action.LOG_OUT, logoutSaga),

    // user
    takeEvery(Action.USER_LOAD, getUserSaga),

    // io
    takeEvery(Action.IO_CONNECT, ioSaga),

    // wallet
    takeEvery(Action.WALLET_LIST, getWalletsSaga),
    takeEvery(Action.WALLET_NEW_GENERATION, generateWalletSaga),
    takeEvery(Action.WALLET_NEW_ACTIVATION, activateWalletSaga),
    takeEvery(Action.WALLET_IMPORT, importWalletSaga),
    takeEvery(Action.WALLET_CHECK_IMPORTED, checkImportedWalletSaga),
  ]);
}
