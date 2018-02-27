import { SET_CODE, SET_MODEL } from '../actions';

const initialState = {
  code: null,
  model: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CODE:
      return Object.assign({}, state, { code: payload });

    case SET_MODEL:
      return Object.assign({}, state, { model: payload });

    default:
      return state;
  }
};
