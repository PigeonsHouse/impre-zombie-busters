// chrome.storageのkey
export const INVISIBLE_USERS = 'invisibleUsers';

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

export type InvisibleReasons = (typeof InvisibleReasons)[keyof typeof InvisibleReasons];

export type UserData = {
    name: string,
    contentId: string,
    avatar: string,
    reason: InvisibleReasons,
};

export type InvisiBleUsers = {
    [key: string]: UserData,
};
