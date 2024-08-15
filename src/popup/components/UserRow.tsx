import type React from "react";
import { useCallback } from "react";
import { openUrl } from "../../chrome";
import { InvisibleReasons, type UserData } from "../../domains";
import {
  Avatar,
  RemoveButton,
  TweetLink,
  UserId,
  UserInfo,
  UserRowBottom,
  UserRowContainer,
  UserRowTop,
  Username,
} from "./UserRow.style";

type UserRowProps = {
  id: string;
  userData: UserData;
  removeUser: (id: string) => void;
};

const UserRow: React.FC<UserRowProps> = ({ id, userData, removeUser }) => {
  const getJapaneseReason = useCallback((reason: InvisibleReasons) => {
    switch (reason) {
      case InvisibleReasons.TooManyEmoji:
        return "絵文字の多いツイート";
      case InvisibleReasons.Parroting:
        return "コピペツイート";
      case InvisibleReasons.TooManyHashtag:
        return "多すぎるハッシュタグ";
      case InvisibleReasons.ContinuousTweet:
        return "リプライの連投";
      case InvisibleReasons.NgWordTweet:
        return "NGワードを含むツイート";
      case InvisibleReasons.NgWordUserName:
        return "NGワードを含むユーザ名";
      case InvisibleReasons.Devanagari:
        return "ヒンディー語を含むユーザ・投稿";
      case InvisibleReasons.Arabian:
        return "アラビア語を含むユーザ・投稿";
    }
  }, []);

  const jumpUserPage = useCallback(() => {
    openUrl(`https://x.com/${id.substring(1)}`);
  }, [id]);

  const jumpTweetPage = useCallback(() => {
    openUrl(userData.contentId);
  }, [userData.contentId]);

  const removeUserHandler = useCallback(() => {
    removeUser(id);
  }, [id, removeUser]);

  return (
    <UserRowContainer>
      <UserRowTop>
        <UserInfo>
          <Avatar src={userData.avatar} alt="" />
          <Username>{userData.name}</Username>
          <UserId onClick={jumpUserPage}>{id}</UserId>
        </UserInfo>
        <RemoveButton onClick={removeUserHandler}>x</RemoveButton>
      </UserRowTop>
      <UserRowBottom>
        <div>原因: {getJapaneseReason(userData.reason)}</div>
        <TweetLink onClick={jumpTweetPage}>該当の投稿を見る</TweetLink>
      </UserRowBottom>
    </UserRowContainer>
  );
};

export default UserRow;
