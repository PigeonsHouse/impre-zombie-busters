import { decodeUserDataList, encodeUserDataList, INVISIBLE_USERS, InvisiBleUsers } from "../utils";

export const restoreInvisibleUsers = async () => {
    return decodeUserDataList((await chrome.storage.local.get(INVISIBLE_USERS))[INVISIBLE_USERS]);
}

export const saveInvisibleUsers = (invisibleUsers: InvisiBleUsers) => {
    chrome.storage.local.set({invisibleUsers: encodeUserDataList(invisibleUsers)});
}

export const getTweets = () => {
    const tweets: NodeListOf<HTMLElement> = document.querySelectorAll('[data-testid="tweet"]');
    return tweets;
}

export const isDisablePage = () => {
    const isHomePage = window.location.pathname === "/home";
    const isUserPage = document.querySelector('nav[aria-label="プロフィールタイムライン"]') !== null;
    return isHomePage || isUserPage;
}

export const getUserId = (tweet: HTMLElement) => {
    return tweet.querySelector('[data-testid="User-Name"]>div:nth-child(2) a[role="link"] span')?.textContent || undefined;
};

const getUserName = (tweet: HTMLElement) => {
    return tweet.querySelector('[data-testid="User-Name"]>div:nth-child(1) a[role="link"] span')?.textContent || undefined;
};

const getUserAvatarUrl = (tweet: HTMLElement) => {
    return (tweet.querySelector('[data-testid^="UserAvatar-Container-"] img') as HTMLImageElement|null)?.src;
};

const getTweetUrl = (tweet: HTMLElement) => {
    return (tweet.querySelector('[data-testid="User-Name"] a:has(time)') as HTMLAnchorElement|null)?.href;
};

export const getTweetInfos = (tweet: HTMLElement) => {
    const userId = getUserId(tweet);
    const userName = getUserName(tweet);
    const contentId = getTweetUrl(tweet);
    const avatar = getUserAvatarUrl(tweet);
    const tweetDom = (tweet.querySelector('[data-testid="tweetText"]') as HTMLDivElement|null);
    const tweetText = tweetDom?.textContent ? tweetDom.textContent : "";
    return {
        userId,
        userName,
        contentId,
        avatar,
        tweetDom,
        tweetText
    }
}

export const getStatusPageInfos = () => {
    const isStatusPage = /\/[^/]+\/status\/.+/.test(window.location.pathname);
    const focussedTweet = document.querySelector('[data-testid="cellInnerDiv"]:has([data-testid="tweetTextarea_0"]):has([data-testid="tweetButtonInline"]) [data-testid="tweet"]');
    const focussedTweetUserId = focussedTweet ? getUserId(focussedTweet as HTMLElement) : null;
    return {
        isStatusPage,
        focussedTweet,
        focussedTweetUserId,
    }
}

export const sleep = (time: number) => new Promise((r) => setTimeout(r, time));
