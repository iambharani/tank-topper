
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const setCurrentUser = (userData) => {
  return {
    type: SET_CURRENT_USER,
    payload: userData,
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

