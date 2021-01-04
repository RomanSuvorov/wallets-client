import { put, call, select } from 'redux-saga/effects';

import Action from '../constants/action';
import fetchHandler from '../utils/helper.fetch';

const getUser = async (token) => {
  try {
    const { firstName, lastName, telegramId, username } = await fetchHandler({ url: '/api/user/info', token });
    return { firstName, lastName, telegramId, username };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function* getUserSaga(action) {
  try {
    const { token } = yield select(state => state.app);
    yield put({ type: Action.USER_LOAD_START });
    const { firstName, lastName, telegramId, username } = yield call(getUser, token);
    yield put({ type: Action.USER_LOAD_SUCCESS, firstName, lastName, telegramId, username });
    yield put({ type: Action.WALLET_LIST });
  } catch (e) {
    console.error(e);
    yield put({ type: Action.USER_LOAD_ERROR, error: e });
  } finally {
    yield put({ type: Action.USER_LOAD_FINISH });
  }
}
