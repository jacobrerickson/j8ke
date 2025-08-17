import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@repo/server/src/models/user"
import { RootState } from "./index";

export enum AppRoles {
    ADMIN = "Admin",
    STANDARD = "Standard",
}

type authState = {
    profile: null | User;
    tokens: null | {
        refresh: string;
        access: string;
    }
    loading: boolean;
}

const initialState: authState = {
    profile: null,
    tokens: null,
    loading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState(state, { payload }: PayloadAction<{ profile: User, tokens: { refresh: string, access: string } }>) {
            state.profile = payload.profile
            state.tokens = payload.tokens
        },
        setProfile(state, { payload }: PayloadAction<User | null>) {
            state.profile = payload
        },
        setLoading(state, { payload }: PayloadAction<boolean>) {
            state.loading = payload
        },
        clearAuthState(state) {
            state.profile = null
            state.tokens = null
        },
        setTokens(state, { payload }: PayloadAction<{ refresh: string, access: string }>) {
            state.tokens = payload
        }
    }
})

export const { setAuthState, setLoading, clearAuthState, setTokens, setProfile } = authSlice.actions

export const getAuthStateValue = <K extends keyof authState>(key: K) =>
    createSelector(
        (state: RootState) => state.auth,
        (auth) => auth[key]
    );

export default authSlice.reducer