export const SET_CODE = 'SET_CODE';
export const SET_MODEL = 'SET_MODEL';

export const setCode = payload => ({
  type: SET_CODE,
  payload,
});

export const setModel = payload => ({
  type: SET_MODEL,
  payload,
});
