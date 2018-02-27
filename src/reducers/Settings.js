import { SET_CODE } from '../actions';

const initialState = {
  code: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CODE:
      return Object.assign({}, state, { code: payload });

    default:
      return state;
  }
};
