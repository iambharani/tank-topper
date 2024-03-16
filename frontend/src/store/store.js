import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk'; // Corrected import
import authReducer from "../reducers/authReducer";
import stationReducer from '../reducers/stationReducer';
import locationReducer from '../reducers/locationReducer';

const rootReducer = {
  auth: authReducer,
  station: stationReducer,
  location: locationReducer
};

const persistedState = localStorage.getItem('user') ? { auth: { user: JSON.parse(localStorage.getItem('user')) } } : {};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  preloadedState: persistedState,
});

export default store;
