import { getFromStorage, setStorage } from "../chrome";
import {
	InvisibleReasons,
	StorageKey,
	decodeUserDataList,
	encodeUserDataList,
} from "../domains";
import {
	getStatusPageInfos,
	getTweetInfos,
	getTweets,
	getUserId,
	isDisablePage,
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
import { sleep } from "./utils";

async function observerFunc() {
	// 非表示処理をしないページはスキップ
	if (isDisablePage()) return;

	// 0.5秒待機
	// WHY: DOM生成が間に合わない場合があり、一部DOMから情報を取得するのに失敗するので、少し待つだけでも挙動の安定性が上がるため
	await sleep(500);

	// ここでlocalStorageから非表示リストを取得する
	const invisibleUsers = decodeUserDataList(
		await getFromStorage(StorageKey.INVISIBLE_USERS),
	);

	// 画面上からTweetのDOM一覧を取得する
	const tweets = getTweets();
	if (tweets.length <= 0) return;

	// 同一の文のツイートか判断するため本文を保持する配列を用意
	const tweetTextList: string[] = [];
	// statusページ特有の情報を取得する
	const { isStatusPage, focussedTweet, focussedTweetUserId } =
		getStatusPageInfos();
	let isAfterFocusedTweet = !isStatusPage;
	const replyUserIdList: string[] = [];

	// 各TweetのDOMから非表示にすべきか判定
	for (const tweet of tweets) {
		// tweetのDOMから取れる情報を取得
		const { userId, userName, contentId, avatar, tweetDom, tweetText } =
			getTweetInfos(tweet);
		// リプライツリーの途中などを見ているときは、ページの対象のツイートより下のツイートだけ検閲する
		if (!isAfterFocusedTweet) {
			if (tweet === focussedTweet) isAfterFocusedTweet = true;
			continue;
		}
		// 取得に失敗したら無視
		if (!userId || !userName || !contentId || !avatar) continue;
		// ページの対象のツイート主がリプライ欄にいるとき、非表示対象にしない
		if (userId === focussedTweetUserId) continue;
		// 非表示に追加済であればスキップ
		if (Object.keys(invisibleUsers).includes(userId)) continue;

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
			continue;
		}
		// コピペツイート
		if (parrotingFilter(tweetText, tweetTextList)) {
			addInvisibleUser(invisibleUsers, userInfos, InvisibleReasons.Parroting);
			continue;
		}
		// NGワードを含むツイート
		if (await ngWordTweetFilter(tweetText)) {
			addInvisibleUser(invisibleUsers, userInfos, InvisibleReasons.NgWordTweet);
			continue;
		}
		// NGワードを含むユーザ名
		if (await ngWordUserNameFilter(userName)) {
			addInvisibleUser(
				invisibleUsers,
				userInfos,
				InvisibleReasons.NgWordUserName,
			);
			continue;
		}
		// TODO: ハッシュタグのレート値の調整機能
		// 多すぎるハッシュタグ
		if (tooManyHashtagFilter(tweetText, isStatusPage)) {
			addInvisibleUser(
				invisibleUsers,
				userInfos,
				InvisibleReasons.TooManyHashtag,
			);
			continue;
		}
		// TODO: └(՞ةڼ◔)」など絵文字の誤検知の対応
		// デーヴァナーガリー文字
		if (devanagariFilter(userName, tweetText)) {
			addInvisibleUser(invisibleUsers, userInfos, InvisibleReasons.Devanagari);
			continue;
		}
		// アラビア文字
		if (arabianFilter(userName, tweetText)) {
			addInvisibleUser(invisibleUsers, userInfos, InvisibleReasons.Arabian);
			continue;
		}

		if (isStatusPage) {
			// リプライの連投
			if (continuousTweetFilter(userId, replyUserIdList)) {
				addInvisibleUser(
					invisibleUsers,
					userInfos,
					InvisibleReasons.ContinuousTweet,
				);
				// continue;
			}
		}

		// TODO: 悪意のある引用リツイートを弾く
		// TODO: ユーザ説明文のNGワード
		// TODO: アンカーリンクのNGワード
	}

	// 非表示対象のツイートを非表示にする
	// TODO: classを付与しておいて、for2周をせずdisplay: noneするようにする
	for (const tweet of tweets) {
		const userId = getUserId(tweet);
		if (!userId) continue;
		if (Object.keys(invisibleUsers).includes(userId)) {
			tweet.style.display = "none";
		}
	}

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
