import React, { useCallback } from 'react';
import { InvisibleReasons, UserData } from '../../domains';
import { Avatar, RemoveButton, TweetLink, UserId, UserInfo, Username, UserRowBottom, UserRowContainer, UserRowTop } from './UserRow.style';

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
      case InvisibleReasons.Devanagari:
        return 'ヒンディー語を含むユーザ・投稿'
      case InvisibleReasons.Arabian:
        return 'アラビア語を含むユーザ・投稿'
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
    <UserRowContainer>
      <UserRowTop>
        <UserInfo>
          <Avatar src={userData.avatar} alt='' />
          <Username>{userData.name}</Username>
          <UserId onClick={jumpUserPage}>{id}</UserId>
        </UserInfo>
        <RemoveButton onClick={removeUser}>x</RemoveButton>
      </UserRowTop>
      <UserRowBottom>
        <div>原因: {getJapaneseReason(userData.reason)}</div>
        <TweetLink onClick={jumpTweetPage}>該当の投稿を見る</TweetLink>
      </UserRowBottom>
    </UserRowContainer>
  )
};

export default UserRow;
