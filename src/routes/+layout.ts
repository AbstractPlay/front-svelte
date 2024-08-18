import { redirect } from "@sveltejs/kit";
import store from "$lib/store";
import { api } from "$lib/api.js";
import { Amplify } from "aws-amplify";

export const ssr = false;
export const prerender = false;

Amplify.configure({
    Auth: {
        // @ts-expect-error - no identity pool id is needed, despite what the type says
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_COGNITO_APPID,
            loginWith: {
                email: true,
                oauth: {
                    domain: import.meta.env.VITE_COGNITO_DOMAIN,
                    redirectSignIn: [
                        import.meta.env.VITE_COGNITO_REDIRECT_LOGIN,
                    ],
                    redirectSignOut: [
                        import.meta.env.VITE_COGNITO_REDIRECT_LOGOUT,
                    ],
                    responseType: "code",
                    scopes: [
                        "aws.cognito.signin.user.admin",
                        "email",
                        "openid",
                    ],
                },
            },
            signUpVerificationMethod: "code",
            userAttributes: {
                email: {
                    required: true,
                },
            },
            allowGuestAccess: false,
            passwordFormat: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialCharacters: false,
            },
        },
    },
});

export function load({ route }) {
    if (route.id === "/") {
        redirect(302, "/about");
    }
    if (store.getState().users.status === "idle") {
        store.dispatch(api.endpoints.getUsers.initiate());
    }
    if (store.getState().me.status === "idle") {
        store.dispatch(api.endpoints.me.initiate());
    }
    return {
        store,
    };
}
