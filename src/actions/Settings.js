export const SET_CODE = 'SET_CODE';
export const SET_MODEL = 'SET_MODEL';
export const SET_TIMING = 'SET_TIMING';

export const setCode = payload => ({
  type: SET_CODE,
  payload,
});

export const setModel = payload => ({
  type: SET_MODEL,
  payload,
});

export const setTiming = payload => ({
  type: SET_TIMING,
  payload,
});
