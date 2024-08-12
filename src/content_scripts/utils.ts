import { decodeUserDataList, encodeUserDataList, INVISIBLE_USERS, InvisiBleUsers } from "../utils";

export const restoreInvisibleUsers = async () => {
    return decodeUserDataList((await chrome.storage.local.get(INVISIBLE_USERS))[INVISIBLE_USERS]);
}

export const saveInvisibleUsers = (invisibleUsers: InvisiBleUsers) => {
    chrome.storage.local.set({invisibleUsers: encodeUserDataList(invisibleUsers)});
}

export const sleep = (time: number) => new Promise((r) => setTimeout(r, time));
