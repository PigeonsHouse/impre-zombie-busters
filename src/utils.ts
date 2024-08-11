type UserData = {
    name?: string,
    contentId?: string,
    avatar?: string,
    reason: InvisibleReasons,
}

export const InvisibleReasons = {
    EmojiOnly: 'emoji only',
    Parroting: 'parroting',
    NgWordTweet: 'ng word tweet',
    NgWordUserName: 'ng word user name',
    TooManyHashtag: 'too many hashtag',
    ContinuousTweet: 'continuous tweet',
    Unknown: 'unknown',
} as const;
export type InvisibleReasons = (typeof InvisibleReasons)[keyof typeof InvisibleReasons];

export type InvisiBleUsers = {
    [key: string]: UserData,
}

export const encodeUserDataList = (data: InvisiBleUsers): string => {
    let encodedString = '';
    for (const [key, value] of Object.entries(data)) {
        encodedString += `${key}###${value.name || " "}###${value.contentId || " "}###${value.avatar || " "}###${value.reason}####`;
    }
    return encodedString;
};

export const decodeUserDataList = (data: string|null): InvisiBleUsers => {
    const decodedData: InvisiBleUsers = {};
    if (data === null) return decodedData;
    const splittedData = data.split('####');
    for (const singleUserData of splittedData) {
        if (singleUserData === '') continue;
        const singleUserDatum = singleUserData.split("###");
        const id = singleUserDatum[0];
        const name = singleUserDatum[1] !== " " ? singleUserDatum[1] : undefined;
        const contentId = singleUserDatum[2] !== " " ? singleUserDatum[2] : undefined;
        const avatar = singleUserDatum[3] !== " " ? singleUserDatum[3] : undefined;
        let reason: InvisibleReasons = InvisibleReasons.Unknown;
        for (const value of Object.values(InvisibleReasons)) {
            if (value === singleUserDatum[4]) {
                reason = value;
                break;
            }
        }
        
        decodedData[id] = {
            name,
            contentId,
            avatar,
            reason,
        }
    }
    return decodedData;
};

export const INVISIBLE_USERS = 'invisibleUsers';