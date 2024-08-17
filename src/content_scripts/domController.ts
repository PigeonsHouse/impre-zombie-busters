import { attributeName } from "../domains";
import { sleep } from "./utils";

// 0.5秒ごとに30回まで取得に挑戦する
const GET_DOM_RETRY_LIMIT = 30;
const RETRY_COOL_TIME_MS = 500;

export const getTweets = () => {
    const tweets: HTMLElement[] = Array.from(
        document.querySelectorAll('[data-testid="tweet"]'),
    );
    return tweets;
};

export const isDisablePage = () => {
    const isHomePage = window.location.pathname === "/home";
    const isUserPage =
        document.querySelector('nav[aria-label="プロフィールタイムライン"]') !==
        null;
    return isHomePage || isUserPage;
};

export const getUserId = async (tweet: HTMLElement) => {
    let userIdDom = null;
    for (let i = 0; i < GET_DOM_RETRY_LIMIT; i++) {
        userIdDom = tweet.querySelector(
            '[data-testid="User-Name"] > div:nth-child(2) a[role="link"] span',
        );
        if (userIdDom) break;
        await sleep(RETRY_COOL_TIME_MS);
    }
    return userIdDom?.textContent || undefined;
};

const getUserName = async (tweet: HTMLElement) => {
    let userNameDom = null;
    for (let i = 0; i < GET_DOM_RETRY_LIMIT; i++) {
        userNameDom = tweet.querySelector(
            '[data-testid="User-Name"] > div:nth-child(1) a[role="link"] > div > div:first-child > span',
        );
        if (userNameDom) break;
        await sleep(RETRY_COOL_TIME_MS);
    }
    if (!userNameDom) return undefined;

    let userName = "";
    for (const child of userNameDom.children) {
        switch (child.tagName) {
            case "IMG":
                userName += (child as HTMLImageElement).alt;
                break;
            case "SPAN":
                userName += child.textContent;
                break;
            default:
                break;
        }
    }
    return userName;
};

const getTweetUrl = async (tweet: HTMLElement) => {
    let tweetAnchorDom = null;
    for (let i = 0; i < GET_DOM_RETRY_LIMIT; i++) {
        tweetAnchorDom = tweet.querySelector(
            '[data-testid="User-Name"] a:has(time)',
        ) as HTMLAnchorElement | null;
        if (tweetAnchorDom) break;
        await sleep(RETRY_COOL_TIME_MS);
    }
    return tweetAnchorDom?.href;
};

const getUserAvatarUrl = async (tweet: HTMLElement) => {
    let avatarImageDom = null;
    for (let i = 0; i < GET_DOM_RETRY_LIMIT; i++) {
        avatarImageDom = tweet.querySelector(
            '[data-testid^="UserAvatar-Container-"] img',
        ) as HTMLImageElement | null;
        if (avatarImageDom) break;
        await sleep(RETRY_COOL_TIME_MS);
    }
    return avatarImageDom?.src;
};

const getTweetDom = async (tweet: HTMLElement) => {
    let tweetDom = null;
    for (let i = 0; i < GET_DOM_RETRY_LIMIT; i++) {
        tweetDom = tweet.querySelector(
            '[data-testid="tweetText"]',
        ) as HTMLImageElement | null;
        if (tweetDom) break;
        await sleep(RETRY_COOL_TIME_MS);
    }
    return tweetDom;
};

export const getTweetInfos = async (tweet: HTMLElement) => {
    const [userId, userName, contentId, avatar, tweetDom] = await Promise.all([
        getUserId(tweet),
        getUserName(tweet),
        getTweetUrl(tweet),
        getUserAvatarUrl(tweet),
        getTweetDom(tweet),
    ]);
    const tweetText = tweetDom?.textContent ?? "";

    return {
        userId,
        userName,
        contentId,
        avatar,
        tweetDom,
        tweetText,
    };
};

const getFocussedTweet = async () => {
    let focussedTweet = null;
    for (let i = 0; i < GET_DOM_RETRY_LIMIT; i++) {
        focussedTweet = document.querySelector(
            '[data-testid="cellInnerDiv"]:has([data-testid="tweetTextarea_0"]):has([data-testid="tweetButtonInline"]) [data-testid="tweet"]',
        ) as HTMLElement | null;
        if (focussedTweet) break;
        await sleep(RETRY_COOL_TIME_MS);
    }
    return focussedTweet;
};

export const getStatusPageInfos = async () => {
    const isStatusPage = /\/[^/]+\/status\/.+/.test(window.location.pathname);
    const focussedTweet = isStatusPage ? await getFocussedTweet() : null;
    const focussedTweetUserId = focussedTweet
        ? await getUserId(focussedTweet)
        : undefined;

    return {
        isStatusPage,
        focussedTweet,
        focussedTweetUserId,
    };
};

export const isPromotionTweet = (tweet: HTMLElement) => {
    const lastColumnChildren = tweet.querySelector(
        "article > div > div > div:last-child > div:last-child > div:last-child > div",
    )?.children;
    return (
        lastColumnChildren?.length === 2 &&
        lastColumnChildren[0].tagName === "svg" &&
        lastColumnChildren[1].tagName === "DIV"
    );
};

export const hideUser = (userId: string) => {
    const elements = document.querySelectorAll(
        `[${attributeName}="${userId}"]`,
    ) as NodeListOf<HTMLElement>;
    for (const element of elements) {
        element.style.display = "none";
    }
};
