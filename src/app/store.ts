import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import userReducer from '@/features/user/userSlice';
import applicationsReducer from '@/features/applications/applicationSlice';
import workSpaceReducer from '@/features/workspace/workspaceSlice';
import employeeReducer from '@/features/employee/employeeSlice';

const sessionPersistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['employee', 'user', 'units', 'applications'],
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  user: userReducer,
  applications: applicationsReducer,
  workspace: workSpaceReducer,
});

const persistedReducer = persistReducer(sessionPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
