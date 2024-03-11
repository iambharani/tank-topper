// actions/authActions.js

// Define action types in actionTypes.js if you haven't already
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

// Action Creator for setting the current user
export const setCurrentUser = (userData) => {
  return {
    type: SET_CURRENT_USER,
    payload: userData,
  };
};
// actions/authActions.js

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

