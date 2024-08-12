import { INVISIBLE_USERS, InvisibleReasons, InvisiBleUsers } from "./domains";

export const encodeUserDataList = (data: InvisiBleUsers): string => {
    let encodedString = '';
    for (const [key, value] of Object.entries(data)) {
        encodedString += `${key}###${value.name}###${value.contentId}###${value.avatar}###${value.reason}####`;
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
        }
    }
    return decodedData;
};

export const saveInvisibleUsers = (invisibleUsers: InvisiBleUsers) => {
    chrome.storage.local.set({invisibleUsers: encodeUserDataList(invisibleUsers)});
};

export const restoreInvisibleUsers = async () => {
    return decodeUserDataList((await chrome.storage.local.get(INVISIBLE_USERS))[INVISIBLE_USERS]);
};
