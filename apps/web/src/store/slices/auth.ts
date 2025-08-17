import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { AuthState, AuthResponse } from '@repo/server/src/models/user';

const initialState: AuthState = {
    profile: null,
    tokens: null,
    loading: false,
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState: (state, action: PayloadAction<AuthResponse>) => {
            state.profile = action.payload.profile;
            state.tokens = action.payload.tokens;
            state.error = null;
        },
        clearAuthState: (state) => {
            state.profile = null;
            state.tokens = null;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setAuthState, clearAuthState, setLoading, setError } = authSlice.actions;

// Selectors
export const getAuthState = (state: RootState) => state.auth;
export const isAuthenticated = (state: { auth: AuthState }) => state.auth.profile !== null;

export const { reducer: authReducer } = authSlice; 