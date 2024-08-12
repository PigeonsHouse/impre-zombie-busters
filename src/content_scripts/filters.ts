import { InvisibleReasons, InvisiBleUsers } from "../utils";

export type UserInfos = {
    userId: string;
    userName: string;
    contentId: string;
    avatar: string;
    tweetText: string;
}

export const tooManyEmojiFilter = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos, tweetDom: HTMLElement|null): boolean => {
    if (!tweetDom) return false;

    let emojiCounter = 0;
    for (const child of tweetDom.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (child.tagName === 'IMG') {
            emojiCounter++;
        }
    }
    if (userInfos.tweetText.length <= emojiCounter) {
        invisibleUsers[userInfos.userId] = {
            name: userInfos.userName,
            avatar: userInfos.avatar,
            contentId: userInfos.contentId,
            reason: InvisibleReasons.TooManyEmoji,
        };
        return true;
    }
    return false;
};

export const parrotingFilter = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos, tweetTextList: string[]) => {
    if (tweetTextList.includes(userInfos.tweetText)) {
        invisibleUsers[userInfos.userId] = {
            name: userInfos.userName,
            avatar: userInfos.avatar,
            contentId: userInfos.contentId,
            reason: InvisibleReasons.Parroting,
        };
        return true;
    }
    tweetTextList.push(userInfos.tweetText);
    return false;
};

export const ngWordTweet = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos) => {
    // TODO: ここをchrome.storage.localから取得する
    const ngWords: string[] = [];
    for (const ngWord of ngWords) {
        if (userInfos.tweetText.includes(ngWord)) {
            invisibleUsers[userInfos.userId] = {
                name: userInfos.userName,
                avatar: userInfos.avatar,
                contentId: userInfos.contentId,
                reason: InvisibleReasons.NgWordTweet,
            };
            return true;
        }
    }
    return false;
};

export const ngWordUserName = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos) => {
    // TODO: ここをchrome.storage.localから取得する
    const ngWords: string[] = [];
    for (const ngWord of ngWords) {
        if (userInfos.userName.includes(ngWord)) {
            invisibleUsers[userInfos.userId] = {
                name: userInfos.userName,
                avatar: userInfos.avatar,
                contentId: userInfos.contentId,
                reason: InvisibleReasons.NgWordUserName,
            };
            return true;
        }
    }
    return false;
};

export const tooManyHashtagFilter = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos, isStatusPage: boolean) => {
    const hashCount = userInfos.tweetText.match(/#/g);
    if (hashCount) {
        const rateHashCount = isStatusPage ? 2 : 4;
        if (hashCount.length >= rateHashCount) {
            invisibleUsers[userInfos.userId] = {
                name: userInfos.userName,
                avatar: userInfos.avatar,
                contentId: userInfos.contentId,
                reason: InvisibleReasons.TooManyHashtag,
            };
            return true;
        }
    }
    return false;
}

export const continuousTweetFilter = (invisibleUsers: InvisiBleUsers, userInfos: UserInfos, replyUserIdList: string[]) => {
    if (replyUserIdList.includes(userInfos.userId)) {
        invisibleUsers[userInfos.userId] = {
            name: userInfos.userName,
            avatar: userInfos.avatar,
            contentId: userInfos.contentId,
            reason: InvisibleReasons.ContinuousTweet,
        };
        return true;
    }
    replyUserIdList.push(userInfos.userId);
    return false;
}
