import { getFromStorage, setStorage } from "../chrome";
import {
    InvisibleReasons,
    StorageKey,
    attributeName,
    decodeUserDataList,
    encodeUserDataList,
} from "../domains";
import {
    getStatusPageInfos,
    getTweetInfos,
    getTweets,
    getUserId,
    hideUser,
    isDisablePage,
    isPromotionTweet,
} from "./domController";
import {
    addInvisibleUser,
    arabianFilter,
    continuousTweetFilter,
    devanagariFilter,
    ngWordTweetFilter,
    ngWordUserNameFilter,
    parrotingFilter,
    tooManyEmojiFilter,
    tooManyHashtagFilter,
} from "./filters";

let tweetCount = 0;
let focussedTweet: HTMLElement | null = null;
let focussedTweetUserId: string | undefined = undefined;
let path = "";

async function observerFunc() {
    // 非表示処理をしないページはスキップ
    if (isDisablePage()) return;

    // ここでlocalStorageから非表示リストを取得する
    const invisibleUsers = decodeUserDataList(
        await getFromStorage(StorageKey.INVISIBLE_USERS),
    );

    // 画面上からTweetのDOM一覧を取得する
    const tweets = getTweets();
    if (tweetCount === tweets.length) return;
    tweetCount = tweets.length;
    if (tweetCount <= 0) return;

    await Promise.all(
        tweets.map(async (tweet) => {
            const userId = await getUserId(tweet);
            if (userId) tweet.setAttribute(attributeName, userId);
        }),
    );

    // 同一の文のツイートか判断するため本文を保持する配列を用意
    const tweetTextList: string[] = [];
    // statusページ特有の情報を取得する
    const {
        isStatusPage,
        focussedTweet: newFocussedTweet,
        focussedTweetUserId: newFocussedTweetUserId,
    } = await getStatusPageInfos();
    if (path !== window.location.pathname) {
        focussedTweet = newFocussedTweet;
        focussedTweetUserId = newFocussedTweetUserId;
    }
    let isAfterFocusedTweet =
        !isStatusPage || !(focussedTweet && tweets.includes(focussedTweet));
    const replyUserIdList: string[] = [];

    path = window.location.pathname;

    // 各TweetのDOMから非表示にすべきか判定
    await Promise.all(
        tweets.map(async (tweet) => {
            // リプライツリーの途中などを見ているときは、ページの対象のツイートより下のツイートだけ検閲する
            if (!isAfterFocusedTweet) {
                if (tweet === focussedTweet) isAfterFocusedTweet = true;
                return;
            }
            // プロモーション広告ツイートは投稿時刻のDOMがないので先んじてスキップする
            if (isPromotionTweet(tweet)) return;
            // tweetのDOMから取れる情報を取得
            const { userId, userName, contentId, avatar, tweetDom, tweetText } =
                await getTweetInfos(tweet);
            if (!userId || !userName || !contentId) return;

            // ページの対象のツイート主がリプライ欄にいるとき、非表示対象にしない
            if (userId === focussedTweetUserId) return;
            // 非表示に追加済であればスキップ
            if (Object.keys(invisibleUsers).includes(userId)) {
                hideUser(userId);
                return;
            }

            // TODO: OKワードの実装

            // 非表示リストに追加するときにいる情報
            const userInfos = {
                userId,
                userName,
                avatar,
                contentId,
            };

            // TODO: 非表示処理のON/OFF機能
            // 絵文字の多いツイート
            if (tooManyEmojiFilter(tweetText, tweetDom)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.TooManyEmoji,
                );
                hideUser(userId);
                return;
            }
            // コピペツイート
            if (parrotingFilter(tweetText, tweetTextList)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.Parroting,
                );
                hideUser(userId);
                return;
            }
            // NGワードを含むツイート
            if (await ngWordTweetFilter(tweetText)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.NgWordTweet,
                );
                hideUser(userId);
                return;
            }
            // NGワードを含むユーザ名
            if (await ngWordUserNameFilter(userName)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.NgWordUserName,
                );
                hideUser(userId);
                return;
            }
            // TODO: ハッシュタグのレート値の調整機能
            // 多すぎるハッシュタグ
            if (tooManyHashtagFilter(tweetText, isStatusPage)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.TooManyHashtag,
                );
                hideUser(userId);
                return;
            }
            // TODO: └(՞ةڼ◔)」など絵文字の誤検知の対応
            // デーヴァナーガリー文字
            if (devanagariFilter(userName, tweetText)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.Devanagari,
                );
                hideUser(userId);
                return;
            }
            // アラビア文字
            if (arabianFilter(userName, tweetText)) {
                addInvisibleUser(
                    invisibleUsers,
                    userInfos,
                    InvisibleReasons.Arabian,
                );
                hideUser(userId);
                return;
            }

            if (isStatusPage) {
                // リプライの連投
                if (continuousTweetFilter(userId, replyUserIdList)) {
                    addInvisibleUser(
                        invisibleUsers,
                        userInfos,
                        InvisibleReasons.ContinuousTweet,
                    );
                    hideUser(userId);
                    return;
                }
            }

            // TODO: 悪意のある引用リツイートを弾く
            // TODO: ユーザ説明文のNGワード
            // TODO: アンカーリンクのNGワード
        }),
    );

    // ここで非表示リスト、NGワードの配列をlocalStorageに保存する
    await setStorage(
        StorageKey.INVISIBLE_USERS,
        encodeUserDataList(invisibleUsers),
    );
}

// DOMの変更を監視するObserverの作成・起動
const observer = new MutationObserver(observerFunc);
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
