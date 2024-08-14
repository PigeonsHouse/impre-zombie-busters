// chrome.storageのkey
export const APP_NAME_KEY = "impre-zombie-busters";

export const StorageKey = {
	INVISIBLE_USERS: "invisibleUsers",
	NG_WORD_TWEET: "ngWordTweet",
	NG_WORD_USERNAME: "ngWordUsername",
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

// 非表示ユーザのデータ構造
export const InvisibleReasons = {
	TooManyEmoji: 0,
	Parroting: 1,
	NgWordTweet: 2,
	NgWordUserName: 3,
	TooManyHashtag: 4,
	ContinuousTweet: 5,
	Devanagari: 6,
	Arabian: 7,
	Unknown: -1,
} as const;

export type InvisibleReasons =
	(typeof InvisibleReasons)[keyof typeof InvisibleReasons];

export type UserData = {
	name: string;
	contentId: string;
	avatar: string;
	reason: InvisibleReasons;
};

export type InvisiBleUsers = {
	[key: string]: UserData;
};

export const encodeNgWords = (ngWords: string[]): string => {
	return ngWords.join("\n");
};

export const decodeNgWords = (ngWordString: string | undefined): string[] => {
	if (ngWordString === undefined) return [];
	return ngWordString.split("\n");
};

export const encodeUserDataList = (data: InvisiBleUsers): string => {
	let encodedString = "";
	for (const [key, value] of Object.entries(data)) {
		encodedString += `${key}\n${value.name}\n${value.contentId}\n${value.avatar}\n${value.reason}\n\n`;
	}
	return encodedString;
};

export const decodeUserDataList = (
	data: string | undefined,
): InvisiBleUsers => {
	const decodedData: InvisiBleUsers = {};
	if (data === undefined) return decodedData;
	const splittedData = data.split("\n\n");
	for (const singleUserData of splittedData) {
		if (singleUserData === "") continue;
		const singleUserDatum = singleUserData.split("\n");
		const id = singleUserDatum[0];
		const reasonNumber = Number(singleUserDatum[4]);
		let reason: InvisibleReasons = InvisibleReasons.Unknown;
		for (const value of Object.values(InvisibleReasons)) {
			if (value === reasonNumber) {
				reason = value;
				break;
			}
		}

		decodedData[id] = {
			name: singleUserDatum[1],
			contentId: singleUserDatum[2],
			avatar: singleUserDatum[3],
			reason,
		};
	}
	return decodedData;
};
