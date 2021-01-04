import { put, call } from 'redux-saga/effects';

import Action from '../constants/action';
import fetchHandler from '../utils/helper.fetch';

const checkServer = async () => {
  return await fetchHandler({ url: '/api/server/checkServer' });
};

const disconnect = () => {
  localStorage.removeItem('simia_token');
  window.logout = true;
  window.socket.disconnect(true);
};

export function* checkServerSaga() {
  try {
    yield put({ type: Action.CHECK_SERVER_START });
    const { sessionID, status } = yield call(checkServer);
    yield put({ type: Action.CHECK_SERVER_SUCCESS, sessionID, status });

    // io saga
    yield put({ type: Action.IO_CONNECT, sessionID });
  } catch (e) {
    console.error(e);
    yield put({ type: Action.CHECK_SERVER_ERROR, error: e.message });
  } finally {
    yield put({ type: Action.CHECK_SERVER_FINISH });
  }
}

export function* logoutSaga() {
  yield call(disconnect);
  yield put({ type: Action.FORCE_LOGOUT });
}
