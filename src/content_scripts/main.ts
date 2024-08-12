import { continuousTweetFilter, ngWordTweet, ngWordUserName, parrotingFilter, tooManyEmojiFilter, tooManyHashtagFilter } from "./filters";
import { getStatusPageInfos, getTweetInfos, getTweets, getUserId, isDisablePage, restoreInvisibleUsers, saveInvisibleUsers, sleep } from "./utils";

async function main() {
    const observer = new MutationObserver(async () => {
        // 0.5秒待機
        // WHY: DOM生成が間に合わない場合があり、一部DOMから情報を取得するのに失敗するので、少し待つだけでも挙動の安定性が上がるため
        await sleep(500);

        // ここでlocalStorageから非表示リストを取得する
        const invisibleUsers = await restoreInvisibleUsers();

        // 画面上からTweetのDOM一覧を取得する
        const tweets = getTweets();
        if (tweets.length <= 0) return;

        if (isDisablePage()) return;

        const tweetTextList: string[] = [];

        const {
            isStatusPage,
            focussedTweet,
            focussedTweetUserId,
        } = getStatusPageInfos();
        let isAfterFocusedTweet = !isStatusPage;
        const replyUserIdList: string[] = [];

        for (const tweet of tweets) {
            const {
                userId,
                userName,
                contentId,
                avatar,
                tweetDom,
                tweetText
            } = getTweetInfos(tweet);
            if (!userId || !userName || !contentId || !avatar || !tweetDom) continue;
            if (!isAfterFocusedTweet) {
                if (tweet === focussedTweet) isAfterFocusedTweet = true;
                continue;
            }
            if (userId === focussedTweetUserId) continue;
            if (Object.keys(invisibleUsers).includes(userId)) continue;

            // TODO: 非表示処理のON/OFF機能
            let isFiltered = false;
            const userInfo = {
                userId,
                userName,
                contentId,
                avatar,
                tweetText
            }

            // フィルター判定と非表示リストへの追加の処理を分ける(DRY)
            isFiltered = tooManyEmojiFilter(invisibleUsers, userInfo, tweetDom);
            if (isFiltered) continue;

            isFiltered = parrotingFilter(invisibleUsers, userInfo, tweetTextList);
            if (isFiltered) continue;

            isFiltered = ngWordTweet(invisibleUsers, userInfo);
            if (isFiltered) continue;

            isFiltered = ngWordUserName(invisibleUsers, userInfo);
            if (isFiltered) continue;

            isFiltered = tooManyHashtagFilter(invisibleUsers, userInfo, isStatusPage);
            if (isFiltered) continue;

            if (isStatusPage) {
                isFiltered = continuousTweetFilter(invisibleUsers, userInfo, replyUserIdList);
                if (isFiltered) continue;
            }

            // TODO: 悪意のある引用リツイートを弾く
            // TODO: アラビア語、ヒンディー語がユーザ名、本文にある人を非表示にする
            // TODO: ユーザ説明文のNGワード
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
        saveInvisibleUsers(invisibleUsers);
    })
    observer.observe(document.body, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
    });
}

main();
