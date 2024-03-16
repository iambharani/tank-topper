import { SET_SELECTED_STATION, CLEAR_SELECTED_STATION } from './../actionTypes';

const initialState = {
    selectedStation: null,
  };

  const stationReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SELECTED_STATION:
        return {
          ...state,
          selectedStation: action.payload,
        };
      case CLEAR_SELECTED_STATION:
        return {
          ...state,
          selectedStation: null,
        };
      default:
        return state;
    }
  };
  
  export default stationReducer;