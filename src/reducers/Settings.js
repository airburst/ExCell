import { SET_CODE, SET_MODEL, SET_TIMING } from '../actions';

const initialState = {
  code: null,
  model: null,
  timing: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CODE:
      return Object.assign({}, state, { code: payload });

    case SET_MODEL:
      return Object.assign({}, state, { model: payload });

    case SET_TIMING:
      return Object.assign({}, state, { timing: payload });

    default:
      return state;
  }
};
