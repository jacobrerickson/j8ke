import { useDispatch, useSelector } from 'react-redux';
import { clearAuthState, getAuthState, setAuthState, setError, setLoading } from '../store/slices/auth';
import { TokensStorage } from '../lib/utils/tokens-storage';
import { client } from '../lib/trpc/client';
import type { RootState } from '../store';

export const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => getAuthState(state));

    const getProfile = async () => {
        try {
            const storedTokens = TokensStorage.getTokens();
            if (!storedTokens) {
                return null;
            }

            const tokens = {
                access: storedTokens.accessToken,
                refresh: storedTokens.refreshToken
            };

            dispatch(setLoading(true));
            const profile = await client.auth.profile.query();
            if (profile) {
                dispatch(setAuthState({ profile, tokens }));
                return profile;
            }
            return null;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            dispatch(setError(message));
            // If there's an error (like invalid/expired token), clear the auth state
            dispatch(clearAuthState());
            TokensStorage.clearTokens();
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signUp = async (name: string, email: string, password: string) => {
        try {
            dispatch(setLoading(true));
            await client.auth.signup.mutate({ name, email, password });
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            dispatch(setLoading(true));
            const response = await client.auth.signin.mutate({ email, password });
            // Sign in now only returns a message about verification code
            return { message: response };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const verifyEmailCode = async (email: string, code: string) => {
        try {
            dispatch(setLoading(true));
            const response = await client.auth.verifyEmailCode.mutate({ email, code });
            if (response.tokens) {
                TokensStorage.setTokens(response.tokens.access, response.tokens.refresh);
                dispatch(setAuthState(response));
            }
            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            dispatch(setError(message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const resendVerificationEmail = async (email: string) => {
        try {
            await client.auth.sendEmailVerificationLink.mutate({ email });
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            if (authState.tokens) {
                await client.auth.signout.mutate({ refreshToken: authState.tokens.refresh });
            }
        } catch (error) {
            console.error('Error during sign out:', error);
        } finally {
            dispatch(clearAuthState());
            TokensStorage.clearTokens();
        }
    };

    return {
        user: authState.profile,
        tokens: authState.tokens,
        loading: authState.loading,
        error: authState.error,
        isAuthenticated: authState.profile !== null,
        signIn,
        signUp,
        verifyEmailCode,
        resendVerificationEmail,
        signOut,
        getProfile,
    };
}; 