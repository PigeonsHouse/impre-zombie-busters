import { decodeUserDataList, encodeUserDataList, INVISIBLE_USERS, InvisibleReasons, InvisiBleUsers } from "../utils";

const getUserName = (tweet: HTMLElement) => {
    return tweet.querySelector('[data-testid="User-Name"]>div:nth-child(1) a[role="link"] span')?.textContent || undefined;
};

const getUserId = (tweet: HTMLElement) => {
    return tweet.querySelector('[data-testid="User-Name"]>div:nth-child(2) a[role="link"] span')?.textContent;
};

const sleep = (time: number) => new Promise((r) => setTimeout(r, time));

async function main() {
    // TODO: フィルタ処理ごとなどで関数に切り出す
    let tweetCount = 0;
    let invisibleUsers: InvisiBleUsers = {};
    // TODO: ここをchrome.storageに移植する
    const ngWordsForUserName: string[] = [];
    const ngWordsForTweet: string[] = [];

    const observer = new MutationObserver(async () => {
        // ここでlocalStorageから非表示リスト、NGワードの配列を取得する
        const userDataString: string = (await chrome.storage.local.get(INVISIBLE_USERS))[INVISIBLE_USERS];
        invisibleUsers = decodeUserDataList(userDataString);

        await sleep(300);

        const tweets: NodeListOf<HTMLElement> = document.querySelectorAll('[data-testid="tweet"]');
        if (tweetCount === tweets.length) return;
        tweetCount = tweets.length;
        if (tweetCount <= 0) return;

        const isDisablePage = window.location.pathname === "/home" || document.querySelector('nav[aria-label="プロフィールタイムライン"]') !== null;
        if (!isDisablePage) {
            const tweetTextList: string[] = [];

            const isStatusPage = /\/[^/]+\/status\/.+/.test(window.location.pathname);
            const focussedTweet = document.querySelector('[data-testid="cellInnerDiv"]:has([data-testid="tweetTextarea_0"]):has([data-testid="tweetButtonInline"]) [data-testid="tweet"]');
            const focussedTweetUserId = focussedTweet ? getUserId(focussedTweet as HTMLElement):null;
            let isAfterFocusedTweet = !isStatusPage;
            const replyUserIdList: string[] = [];

            for (const tweet of tweets) {
                const userName = getUserName(tweet);
                const userId = getUserId(tweet);
                const contentId = (tweet.querySelector('[data-testid="User-Name"] a:has(time)') as HTMLAnchorElement|null)?.href;
                const avatar = (tweet.querySelector('[data-testid^="UserAvatar-Container-"] img') as HTMLImageElement|null)?.src;
                const tweetDom = tweet.querySelector('[data-testid="tweetText"]');
                if (!userId || !tweetDom) continue;
                if (!isAfterFocusedTweet) {
                    if (tweet === focussedTweet) isAfterFocusedTweet = true;
                    continue;
                }
                if (userId === focussedTweetUserId) continue;
                if (Object.keys(invisibleUsers).includes(userId)) continue;
                
                // TODO: 非表示処理のON/OFF機能
                // 絵文字しか含まれていないツイートは非表示
                let isOnlyEmoji = true;
                for (const child of tweetDom.children) {
                    if (!(child instanceof HTMLElement)) continue;
                    if (child.tagName !== 'IMG') {
                        isOnlyEmoji = false;
                        break;
                    }
                }
                if (isOnlyEmoji) {
                    invisibleUsers[userId] = {
                        name: userName,
                        avatar: avatar,
                        contentId: contentId,
                        reason: InvisibleReasons.EmojiOnly,
                    };
                }

                const tweetText = tweetDom.textContent;
                if (tweetText) {
                    // だれかのツイートを丸々コピペしてるやつは非表示
                    if (tweetTextList.includes(tweetText)) {
                        invisibleUsers[userId] = {
                            name: userName,
                            avatar: avatar,
                            contentId: contentId,
                            reason: InvisibleReasons.Parroting,
                        };
                    } else {
                        tweetTextList.push(tweetText);
                    }

                    // NGワードが入っているツイートは非表示
                    for (const ngWord of ngWordsForTweet) {
                        if (tweetText.includes(ngWord)) {
                            invisibleUsers[userId] = {
                                name: userName,
                                avatar: avatar,
                                contentId: contentId,
                                reason: InvisibleReasons.NgWordTweet,
                            };
                            break;
                        }
                    }

                    // ハッシュタグが余分についている場合は非表示
                    const hashCount = tweetText.match(/#/g);
                    if (hashCount) {
                        const rateHashCount = isStatusPage ? 2 : 4;
                        if (hashCount.length >= rateHashCount) {
                            invisibleUsers[userId] = {
                                name: userName,
                                avatar: avatar,
                                contentId: contentId,
                                reason: InvisibleReasons.TooManyHashtag,
                            };
                        }
                    }
                }

                // ユーザネームにNGワードが入っているツイートは非表示
                if (userName) {
                    for (const ngWord of ngWordsForUserName) {
                        if (userName.includes(ngWord)) {
                            invisibleUsers[userId] = {
                                name: userName,
                                avatar: avatar,
                                contentId: contentId,
                                reason: InvisibleReasons.NgWordUserName,
                            };
                            break;
                        }
                    }
                }

                if (isStatusPage) {
                    // リプライで連投しているツイートは非表示
                    if (replyUserIdList.includes(userId)) {
                        invisibleUsers[userId] = {
                            name: userName,
                            avatar: avatar,
                            contentId: contentId,
                            reason: InvisibleReasons.ContinuousTweet,
                        };
                    } else {
                        replyUserIdList.push(userId);
                    }
                }
                
                // TODO: 悪意のある引用リツイートを弾く
                // TODO: アラビア語、ヒンディー語がユーザ名、本文にある人を非表示にする
                // TODO: ユーザ説明文のNGワード
                // TODO: 非表示ユーザ確認のforのcontinueを追加する
            }
        }

        // 非表示対象のツイートを非表示にする
        for (const tweet of tweets) {
            const userId = getUserId(tweet);
            if (!userId) continue;
            if (Object.keys(invisibleUsers).includes(userId)) {
                tweet.style.display = 'none';
            };
        }

        // ここで非表示リスト、NGワードの配列をlocalStorageに保存する
        await chrome.storage.local.set({invisibleUsers: encodeUserDataList(invisibleUsers)});
    })
    observer.observe(document.body, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
    });
}

main();
