import { configureStore } from '@reduxjs/toolkit';

// Placeholder reducer - replace with actual reducers as needed
const placeholderReducer = (state = {}) => state;

export const store = configureStore({
    reducer: {
        placeholder: placeholderReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 