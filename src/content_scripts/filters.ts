import { getFromStorage } from "../chrome";
import {
	type InvisiBleUsers,
	type InvisibleReasons,
	StorageKey,
	decodeNgWords,
} from "../domains";

export const tooManyEmojiFilter = (
	tweetText: string,
	tweetDom: HTMLElement | null,
) => {
	if (!tweetDom) return false;

	let emojiCounter = 0;
	for (const child of tweetDom.children) {
		if (!(child instanceof HTMLElement)) continue;
		if (child.tagName === "IMG") {
			emojiCounter++;
		}
	}
	return emojiCounter > 0 && tweetText.length <= emojiCounter;
};

export const parrotingFilter = (tweetText: string, tweetTextList: string[]) => {
	if (tweetTextList.includes(tweetText)) return true;
	tweetTextList.push(tweetText);
	return false;
};

export const ngWordTweetFilter = async (tweetText: string) => {
	const ngWords = decodeNgWords(await getFromStorage(StorageKey.NG_WORD_TWEET));
	for (const ngWord of ngWords) {
		if (ngWord === "") continue;
		if (tweetText.includes(ngWord)) return true;
	}
	return false;
};

export const ngWordUserNameFilter = async (userName: string) => {
	const ngWords = decodeNgWords(
		await getFromStorage(StorageKey.NG_WORD_USERNAME),
	);
	for (const ngWord of ngWords) {
		if (ngWord === "") continue;
		if (userName.includes(ngWord)) return true;
	}
	return false;
};

export const tooManyHashtagFilter = (
	tweetText: string,
	isStatusPage: boolean,
) => {
	const hashCount = tweetText.match(/#/g);
	if (!hashCount) return false;

	const rateHashCount = isStatusPage ? 2 : 4;
	return hashCount.length >= rateHashCount;
};

export const continuousTweetFilter = (
	userId: string,
	replyUserIdList: string[],
) => {
	if (replyUserIdList.includes(userId)) return true;
	replyUserIdList.push(userId);
	return false;
};

export const devanagariFilter = (userName: string, tweetText: string) => {
	const regex = /[\u0900-\u097F]/;
	return regex.test(userName) || regex.test(tweetText);
};

export const arabianFilter = (userName: string, tweetText: string) => {
	const regex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
	return regex.test(userName) || regex.test(tweetText);
};

type UserInfos = {
	userId: string;
	userName: string;
	avatar: string;
	contentId: string;
};

export const addInvisibleUser = (
	invisibleUsers: InvisiBleUsers,
	userInfos: UserInfos,
	reason: InvisibleReasons,
) => {
	invisibleUsers[userInfos.userId] = {
		name: userInfos.userName,
		avatar: userInfos.avatar,
		contentId: userInfos.contentId,
		reason,
	};
};
