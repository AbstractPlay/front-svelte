import i18next from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export type i18nextType = typeof i18next;
i18next
	.use(HttpBackend)
	.use(LanguageDetector)
	.init({
		detection: {
			order: ['querystring', 'localStorage', 'navigator'],
			caches: ['localStorage'],
			lookupQuerystring: 'lng',
			lookupLocalStorage: 'locale'
		},
		lng: 'en',
		fallbackLng: 'en',
		ns: 'apfront',
		defaultNS: 'apfront',
		debug: true,
		keySeparator: '.',
		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json'
		},
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default () => createI18nStore(i18next);
