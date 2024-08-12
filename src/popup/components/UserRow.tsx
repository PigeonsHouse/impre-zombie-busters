import React, { useCallback } from 'react';
import { InvisibleReasons, UserData } from '../../utils';

type UserRowProps = {
  id: string,
  userData: UserData
}

const UserRow: React.FC<UserRowProps> = ({id, userData}) => {
  const getJapaneseReason = useCallback((reason: InvisibleReasons) => {
    switch (reason) {
      case InvisibleReasons.TooManyEmoji:
        return '絵文字の多いツイート'
      case InvisibleReasons.Parroting:
        return 'コピペツイート'
      case InvisibleReasons.TooManyHashtag:
        return '多すぎるハッシュタグ'
      case InvisibleReasons.ContinuousTweet:
        return 'リプライの連投'
      case InvisibleReasons.NgWordTweet:
        return 'NGワードを含むツイート'
      case InvisibleReasons.NgWordUserName:
        return 'NGワードを含むユーザ名'
    }
  }, []);

  const jumpUserPage = useCallback(() => {
    chrome.tabs.create({url: `https://x.com/${id.substring(1)}`})
  }, [id]);

  // TODO: 非表示ユーザの削除処理作成
  const removeUser = useCallback(() => {
    alert('未実装！！');
  }, []);

  const jumpTweetPage = useCallback(() => {
    chrome.tabs.create({url: userData.contentId})
  }, [userData.contentId]);

  return (
    <div className='user-row-container'>
      <div className='user-row-top'>
        <div className='user-info'>
          <img src={userData.avatar} alt='' className='avatar' />
          <div className='username'>{userData.name}</div>
          <div className='user-id' onClick={jumpUserPage}>{id}</div>
        </div>
        <div className='remove-button' onClick={removeUser}>x</div>
      </div>
      <div className='user-row-bottom'>
        <div>原因: {getJapaneseReason(userData.reason)}</div>
        <div onClick={jumpTweetPage} className='tweet-link'>該当のツイートを見る</div>
      </div>
    </div>
  )
};

export default UserRow;
