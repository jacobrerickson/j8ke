import { Storage } from "@/utils/async-storage";
import { client } from "@/utils/trpc-provider";
import { User } from "@repo/server/src/models/user";
import { useDispatch } from "react-redux";
import { setProfile, setTokens } from "./auth";

export default function useAuthStore() {
    const dispatch = useDispatch()

    const sendForgotPasswordLink = async (email: string) => {
        await client.auth.forgotPassword.mutate({
            email,
        });
    }

    const verifyEmailCode = async (email: string, code: string) => {
        const res = await client.auth.verifyEmailCode.mutate({
            email,
            code,
        });
        const { profile, tokens } = res as { profile: User; tokens: { refresh: string; access: string } };
        await Storage.save(Storage.keys.AUTH_TOKEN, tokens.access);
        await Storage.save(Storage.keys.REFRESH_TOKEN, tokens.refresh);
        dispatch(setProfile(profile))
        dispatch(setTokens(tokens))
    }


    const sendEmailVerification = async (email: string) => {
        await client.auth.sendEmailVerificationLink.mutate({
            email,
        });
    };

    const signOut = async () => {
        await Storage.remove(Storage.keys.AUTH_TOKEN);
        await Storage.remove(Storage.keys.REFRESH_TOKEN);
        dispatch(setProfile(null));
        dispatch(setTokens({ access: "", refresh: "" }));
    }

    const signUp = async (name: string, email: string, password: string) => {
        await client.auth.signup.mutate({
            name,
            email,
            password,
        });
        await Storage.save(Storage.keys.EMAIL, email);
        await Storage.save(Storage.keys.PASSWORD, password);
    }


    const signIn = async (email: string, password: string, rememberme: boolean) => {
        if (rememberme) {
            await Storage.save(Storage.keys.EMAIL, email);
            await Storage.save(Storage.keys.PASSWORD, password);
        }
        await client.auth.signin.mutate({
            email,
            password,
        })
    }

    const init = async () => {
        const authToken = await Storage.get(Storage.keys.AUTH_TOKEN);
        const refreshToken = await Storage.get(Storage.keys.REFRESH_TOKEN);
        if (authToken && refreshToken) {
            const res = await client.auth.profile.query();
            const profile = res as User;
            dispatch(setProfile(profile));
            dispatch(setTokens({ access: authToken, refresh: refreshToken }));
        }
    }

    return {
        init,
        signIn,
        signOut,
        signUp,
        sendEmailVerification,
        verifyEmailCode,
        sendForgotPasswordLink
    }
}