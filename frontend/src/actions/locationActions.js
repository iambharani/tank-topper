import { SET_USER_LOCATION } from './../actionTypes';

export const setUserLocation = (location) => ({
  type: SET_USER_LOCATION,
  payload: location,
});
