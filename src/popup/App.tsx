import { useCallback, useEffect, useState } from 'react';
import { getFromStorage, setStorage } from '../chrome';
import { decodeUserDataList, encodeUserDataList, InvisiBleUsers, StorageKey } from '../domains';
import ResetButton from './components/ResetButton';
import UserRow from './components/UserRow';
import { AppContainer } from './App.style';

function App() {
  const [data, setData] = useState<InvisiBleUsers>({});

  useEffect(() => {
    (async () => {
      const usersString = await getFromStorage(StorageKey.INVISIBLE_USERS);
      setData(decodeUserDataList(usersString));
    })();
  }, []);

  const resetUserData = useCallback(() => {
    (async () => {
      await setStorage(StorageKey.INVISIBLE_USERS, "");
      setData({});
    })();
  }, [setData]);

  const removeUser = useCallback((id: string) => {
    (async () => {
      const tmpData = { ...data };
      delete tmpData[id];
      await setStorage(StorageKey.INVISIBLE_USERS, encodeUserDataList(tmpData));
      setData(tmpData);
    })();
  }, [data, setData]);

  // TODO: NGワード設定UIの作成
  return (
    <AppContainer>
      <ResetButton resetUserData={resetUserData} />
      {Object.entries(data).reverse().map(([id, userData]) => {
        return <UserRow id={id} userData={userData} removeUser={removeUser} />
      })}
    </AppContainer>
  )
}

export default App
