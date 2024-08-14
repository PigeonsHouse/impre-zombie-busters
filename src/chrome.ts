import type { StorageKey } from "./domains";

export const openUrl = (url: string) => chrome.tabs.create({ url });

export const getFromStorage = async (key: StorageKey) => {
	const result = await chrome.storage.local.get(key);
	const value: string | undefined = result[key];
	return value;
};

export const setStorage = async (key: StorageKey, value: string) => {
	await chrome.storage.local.set({ [key]: value });
};
