/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_COGNITO_USER_POOL_ID: string;
	readonly VITE_COGNITO_DOMAIN: string;
	readonly VITE_COGNITO_APPID: string;
	readonly VITE_COGNITO_COOKIE_DOMAIN: string;
	readonly VITE_COGNITO_REDIRECT_LOGIN: string;
	readonly VITE_COGNITO_REDIRECT_LOGOUT: string;
	readonly VITE_API_ENDPOINT: string;
	readonly VITE_API_OPEN: string;
	readonly VITE_API_AUTH: string;
	readonly VITE_PUSH_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
