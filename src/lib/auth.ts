import { fetchAuthSession } from "aws-amplify/auth";

export const getToken = async (): Promise<string|null> => {
    console.log("Trying to get a token");
    let token: string|null = null;
    try {
        const session = await fetchAuthSession();
        console.log(`Session:`, session);
        if (session !== undefined && session.tokens !== undefined) {
            token = session.tokens.accessToken.toString();
        }
    } catch (err) {
        // don't do anything if not logged in
        console.log(`Could not get an authorized session`, err);
    }
    return token;
}
