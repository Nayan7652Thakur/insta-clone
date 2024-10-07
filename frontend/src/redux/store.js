import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default to local storage
import socketSlice from "./socketSlice";
import chatSlice from "./chatSlice";
import rtnSlice from "./rtnSlice";

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // whitelist: ['auth'], // Optionally, only persist specific slices
  // blacklist: ['someOtherSlice'], // Optionally, prevent some slices from being persisted
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio : socketSlice,
chat : chatSlice,
realTimeNotification : rtnSlice 
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Set up store with middleware handling for redux-persist actions
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
