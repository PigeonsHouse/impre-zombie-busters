import { InvisibleReasons, InvisiBleUsers } from "../utils";

export const tooManyEmojiFilter = (tweetText: string, tweetDom: HTMLElement|null): boolean => {
    if (!tweetDom) return false;

    let emojiCounter = 0;
    for (const child of tweetDom.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (child.tagName === 'IMG') {
            emojiCounter++;
        }
    }
    return tweetText.length <= emojiCounter;
};

export const parrotingFilter = (tweetText: string, tweetTextList: string[]) => {
    if (tweetTextList.includes(tweetText)) return true;
    tweetTextList.push(tweetText);
    return false;
};

export const ngWordTweetFilter = (tweetText: string) => {
    // TODO: ここをchrome.storage.localから取得する
    const ngWords: string[] = [];
    for (const ngWord of ngWords) {
        if (tweetText.includes(ngWord)) return true;
    }
    return false;
};

export const ngWordUserNameFilter = (userName: string) => {
    // TODO: ここをchrome.storage.localから取得する
    const ngWords: string[] = [];
    for (const ngWord of ngWords) {
        if (userName.includes(ngWord)) return true;
    }
    return false;
};

export const tooManyHashtagFilter = (tweetText: string, isStatusPage: boolean) => {
    const hashCount = tweetText.match(/#/g);
    if (!hashCount) return false;

    const rateHashCount = isStatusPage ? 2 : 4;
    return hashCount.length >= rateHashCount;
}

export const continuousTweetFilter = (userId: string, replyUserIdList: string[]) => {
    if (replyUserIdList.includes(userId)) return true;
    replyUserIdList.push(userId);
    return false;
}

type UserInfos = {
    userId: string;
    userName: string;
    avatar: string;
    contentId: string;
};

export const addInvisibleUser = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos, reason: InvisibleReasons) => {
    invisibleUsers[userInfos.userId] = {
        name: userInfos.userName,
        avatar: userInfos.avatar,
        contentId: userInfos.contentId,
        reason,
    };
};
