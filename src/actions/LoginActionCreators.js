import {
  REGISTER_START, REGISTER_COMPLETE,
  LOGIN_START, LOGIN_COMPLETE, SET_TOKEN,
  LOGOUT_START, LOGOUT_COMPLETE
} from '../constants/actionTypes/auth';
import { LOAD_ALL_PLAYLISTS_START } from '../constants/actionTypes/playlists';
import * as Session from '../utils/Session';
import * as Socket from '../utils/Socket';
import { get, post } from './RequestActionCreators';
import { advance, loadHistory } from './BoothActionCreators';
import {
  setPlaylists, selectPlaylist, activatePlaylistComplete
} from './PlaylistActionCreators';
import { closeLoginDialog } from './DialogActionCreators';
import { syncTimestamps } from './TickerActionCreators';
import { setUsers } from './UserActionCreators';
import { setVoteStats } from './VoteActionCreators';
import { setWaitList } from './WaitlistActionCreators';
import { currentUserSelector, tokenSelector } from '../selectors/userSelectors';

const debug = require('debug')('uwave:actions:login');

export function loginComplete({ jwt, user }) {
  Socket.auth(jwt);
  return dispatch => {
    dispatch({
      type: LOGIN_COMPLETE,
      payload: { jwt, user }
    });
    dispatch(closeLoginDialog());
  };
}

export function loadedState(state) {
  return (dispatch, getState) => {
    dispatch(setUsers(state.users || []));
    dispatch(setPlaylists(state.playlists || []));
    dispatch(setWaitList({
      waitlist: state.waitlist,
      locked: state.waitlistLocked
    }));
    if (state.booth) {
      // TODO don't set this when logging in _after_ entering the page?
      dispatch(advance(state.booth));
      dispatch(setVoteStats(state.booth.stats));
    }
    if (state.user) {
      const token = tokenSelector(getState());
      dispatch(loginComplete({
        jwt: token,
        user: state.user
      }));
    }
    if (state.activePlaylist) {
      dispatch(activatePlaylistComplete(state.activePlaylist));
      dispatch(selectPlaylist(state.activePlaylist));
    }
  };
}

export function initState() {
  const beforeTime = Date.now();

  return get('/now', {
    onStart: () => ({ type: LOAD_ALL_PLAYLISTS_START }),
    onComplete: state => dispatch => {
      dispatch(syncTimestamps(beforeTime, state.time));
      dispatch(loadedState(state));
      dispatch(loadHistory());
    }
  });
}

export function setJWT(jwt) {
  return {
    type: SET_TOKEN,
    payload: { jwt }
  };
}

function loginStart() {
  return { type: LOGIN_START };
}

export function login({ email, password }) {
  return post('/auth/login', { email, password }, {
    onStart: loginStart,
    onComplete: res => dispatch => {
      Session.set(res.jwt);
      dispatch(setJWT(res.jwt));
      dispatch(initState());
    },
    onError: error => ({
      type: LOGIN_COMPLETE,
      error: true,
      payload: error
    })
  });
}

export function register({ email, username, password }) {
  return post('/auth/register', { email, username, password, passwordRepeat: password }, {
    onStart: () => ({ type: REGISTER_START }),
    onComplete: user => dispatch => {
      debug('registered', user);
      dispatch({
        type: REGISTER_COMPLETE,
        payload: { user }
      });
      dispatch(login({ email, password }));
    },
    onError: error => ({
      type: REGISTER_COMPLETE,
      error: true,
      payload: error
    })
  });
}

function logoutStart() {
  return { type: LOGOUT_START };
}

function logoutComplete() {
  return dispatch => {
    dispatch({ type: LOGOUT_COMPLETE });
    dispatch(setPlaylists([]));
  };
}

export function logout() {
  return (dispatch, getState) => {
    const me = currentUserSelector(getState());
    Session.unset();
    if (me) {
      dispatch(logoutStart());
      dispatch(logoutComplete());
    } else {
      dispatch(logoutComplete());
    }
  };
}
