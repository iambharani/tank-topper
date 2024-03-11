// reducers/authReducer.js

import { SET_CURRENT_USER, LOGOUT_USER } from '../actions/authActions';

const initialState = {
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null, // Reset user state to represent no authenticated user
      };
    default:
      return state;
  }
};

export default authReducer;

