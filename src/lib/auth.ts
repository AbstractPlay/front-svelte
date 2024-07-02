import { fetchAuthSession } from "aws-amplify/auth";

export const getToken = async (): Promise<string|null> => {
    let token: string|null = null;
    try {
        const session = await fetchAuthSession();
        if (session !== undefined && session.tokens !== undefined && session.tokens.idToken !== undefined) {
            token = session.tokens.idToken.toString();
        }
    } catch (err) {
        // don't do anything if not logged in
    }
    return token;
}
