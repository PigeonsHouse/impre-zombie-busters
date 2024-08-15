import type React from "react";
import type { InvisiBleUsers } from "../../domains";
import { ResetButton, Title } from "./UserList.style";
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
      <Title>
        <div>非表示ユーザリスト</div>
        <ResetButton onClick={resetUserData}>リセットする</ResetButton>
      </Title>
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
