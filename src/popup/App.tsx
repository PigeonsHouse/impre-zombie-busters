import { useCallback, useEffect, useState } from 'react';
import { decodeUserDataList, INVISIBLE_USERS, InvisiBleUsers } from '../utils';
import ResetButton from './components/ResetButton';
import UserRow from './components/UserRow';
import './App.css'

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
    <div id='app'>
      <ResetButton resetUserData={resetUserData} />
      {Object.entries(data).reverse().map(([id, userData]) => <UserRow id={id} userData={userData} />)}
    </div>
  )
}

export default App
