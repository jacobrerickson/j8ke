import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';

const reducers = combineReducers({
    auth: authReducer,
})

export const store = configureStore({
    reducer: reducers,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>

export default store