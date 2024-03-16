import { SET_SELECTED_STATION, CLEAR_SELECTED_STATION } from './../actionTypes';

export const setSelectedStation = (station) => {
    return {
      type: SET_SELECTED_STATION,
      payload: station,
    };
  };

  export const clearSelectedStation = () => {
    return {
      type: CLEAR_SELECTED_STATION,
    };
  };