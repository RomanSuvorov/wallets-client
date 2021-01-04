import io from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';

import Config from '../config';
import Action from '../constants/action';

const ioConnect = async (sessionID, token) => {
  const socket = await io((Config.url || '') + '/');
  window.socket = socket;

  return await new Promise(resolve => {
    socket.on('connect', () => {
      socket.emit('prepare', { sessionID });

      if (token) {
        console.log('token', token);
        socket.emit('authenticate', { token });
      }

      resolve(socket);
    });
  });
};

const ioSubscribe = (socket) => {
  return eventChannel(emit => {
    socket.on('login', ({ token }) => {
      console.log('login');
      window.socket.emit('authenticate', { token });
    });
    socket.on('forceLogOut', () => {
      emit({ type: Action.FORCE_LOGOUT });
    });
    socket.on('authenticated', ({ token }) => {
      console.log('authenticated', token);
      emit({ type: Action.APP_AUTHENTICATED, token });
      emit({ type: Action.FINISH_CHECK_EXISTED_USER });
      if (token) {
        localStorage.setItem('simia_token', JSON.stringify(token));
      }

      if (window.disconnected) {
        window.disconnected = false;
        console.log('Reconnected to server.');
      }
    });
    socket.on('unauthenticated', () => {
      console.log('unauthenticated');
      emit({ type: Action.FINISH_CHECK_EXISTED_USER });
    })
    socket.on('disconnect', () => {
      if (window.logout) {
        window.logout = false;
      } else {
        window.disconnected = true;
        console.log('Connection lost. Trying to reconnect...');
      }
    });
    return () => {};
  });
};

export function* ioSaga({ sessionID }) {
  const token = JSON.parse(localStorage.getItem('simia_token'));
  if (token) {
    yield put({ type: Action.START_CHECK_EXISTED_USER })
  }

  const socket = yield call(ioConnect, sessionID, token);
  const channel = yield call(ioSubscribe, socket);

  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}
