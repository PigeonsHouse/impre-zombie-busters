import { useCallback, useEffect, useState } from 'react';
import { decodeUserDataList } from '../chrome';
import { INVISIBLE_USERS, InvisiBleUsers } from '../domains';
import ResetButton from './components/ResetButton';
import UserRow from './components/UserRow';
import { AppContainer } from './App.style';

function App() {
  const [data, setData] = useState<InvisiBleUsers>({});

  useEffect(() => {
    chrome.storage.local.get(INVISIBLE_USERS).then(v => {
      setData(decodeUserDataList(v[INVISIBLE_USERS]));
    });
  }, []);

  const resetUserData = useCallback(() => {
    setData({});
  }, [setData]);

  // TODO: NGワード設定UIの作成
  return (
    <AppContainer>
      <ResetButton resetUserData={resetUserData} />
      {Object.entries(data).reverse().map(([id, userData]) => <UserRow id={id} userData={userData} />)}
    </AppContainer>
  )
}

export default App
