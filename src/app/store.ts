import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import userReducer from '@/features/user/userSlice';
import applicationsReducer from '@/features/applications/applicationSlice';
import employeeReducer from '@/features/employee/employeeSlice';
import allRoleReducer from '@/features/roleManagement/roleSlice';
import claimReducer from '@/features/user/claim/claimSlice';
import masterRoleReducer from '@/features/allRole/materRoleListSlice';
import empRoleListReducer from '@/features/allRole/empRoleListSlice';
import getAdvanceClaimReducer from '@/features/medicalClaim/getAdvanceClaimSlice';
import getClaimDetailsReducer from '@/features/medicalClaim/getClaimDetailsSlice';

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ['employee', 'user', 'applications', 'allRole', 'claim'],
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  user: userReducer,
  applications: applicationsReducer,
  roles: allRoleReducer,
  claim: claimReducer,
  masterRole: masterRoleReducer,
  empRoleList: empRoleListReducer,
  getAdvanceClaim: getAdvanceClaimReducer,
  getClaimDetails: getClaimDetailsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persister = persistStore(store);

// Define types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
