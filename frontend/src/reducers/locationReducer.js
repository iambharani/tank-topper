// locationReducer.js

import { SET_USER_LOCATION } from '../actionTypes';

const initialState = {
  latitude: null,
  longitude: null,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_LOCATION:
      return {
        ...state,
        ...action.payload, // Expecting payload to be an object { latitude, longitude }
      };
    default:
      return state;
  }
};

export default locationReducer;
