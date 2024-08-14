import React from "react";
import { InvisiBleUsers } from "../../domains";
import UserRow from "./UserRow";
import { Title, ResetButton } from "./UserList.style";

type UserListProps = {
  resetUserData: () => void,
  data: InvisiBleUsers,
  removeUser: (id: string) => void,
}

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
      {Object.entries(data).reverse().map(([id, userData]) => {
        return <UserRow id={id} userData={userData} removeUser={removeUser} />
      })}
    </>
  )
}

export default UserList;
