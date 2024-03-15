import { createStore, applyMiddleware, combineReducers } from "redux";
import {thunk} from 'redux-thunk'; // Corrected import statement for thunk
import authReducer from "./../reducers/authReducer"; // Ensure the path is correct
import { composeWithDevTools } from '@redux-devtools/extension';

// Assuming loginUserSuccess is correctly placed elsewhere (e.g., in your actions file)

const rootReducer = combineReducers({
  auth: authReducer,
});

// Example initialization of Redux store state from local storage
const persistedState = localStorage.getItem('user') ? { auth: { user: JSON.parse(localStorage.getItem('user')) } } : {};

// Create the store with the persisted state
const store = createStore(
  rootReducer,
  persistedState,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);

export default store;
