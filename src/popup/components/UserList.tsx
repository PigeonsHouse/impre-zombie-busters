import type React from "react";
import type { InvisiBleUsers } from "../../domains";
import { Header, ResetButton, Title, TitleWrapper } from "./UserList.style";
import UserRow from "./UserRow";

type UserListProps = {
  resetUserData: () => void;
  data: InvisiBleUsers;
  removeUser: (id: string) => void;
};

const UserList: React.FC<UserListProps> = ({
  resetUserData,
  data,
  removeUser,
}) => {
  return (
    <>
      <Header>
        <TitleWrapper>
          <Title>非表示ユーザリスト</Title>
          <div>({Object.keys(data).length}人)</div>
        </TitleWrapper>
        <ResetButton onClick={resetUserData}>リセットする</ResetButton>
      </Header>
      {Object.entries(data)
        .reverse()
        .map(([id, userData]) => {
          return (
            <UserRow
              key={id}
              id={id}
              userData={userData}
              removeUser={removeUser}
            />
          );
        })}
    </>
  );
};

export default UserList;
