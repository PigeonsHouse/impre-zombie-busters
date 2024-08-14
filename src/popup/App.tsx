import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { getFromStorage, setStorage } from '../chrome';
import { decodeUserDataList, encodeUserDataList, InvisiBleUsers, StorageKey } from '../domains';
import { AppContainer } from './App.style';
import NgWordEditor from './components/NgWordEditor';
import UserList from './components/UserList';

function App() {
  const [data, setData] = useState<InvisiBleUsers>({});
  const [ngWordTweet, setNgWordTweet] = useState('');
  const [ngWordUsername, setNgWordUsername] = useState('');

  useEffect(() => {
    (async () => {
      setData(decodeUserDataList(await getFromStorage(StorageKey.INVISIBLE_USERS)));
      setNgWordTweet((await getFromStorage(StorageKey.NG_WORD_TWEET)) || '');
      setNgWordUsername((await getFromStorage(StorageKey.NG_WORD_USERNAME)) || '');
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

  const ngWordTweetChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setNgWordTweet(e.target.value);
  }, []);

  const saveNgWordTweetHandler = useCallback(async () => {
    await setStorage(StorageKey.NG_WORD_TWEET, ngWordTweet);
  }, [ngWordTweet]);

  const ngWordUsernameChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setNgWordUsername(e.target.value);
  }, []);

  const saveNgWordUsernameHandler = useCallback(async () => {
    await setStorage(StorageKey.NG_WORD_USERNAME, ngWordUsername);
  }, [ngWordUsername]);

  return (
    <AppContainer>
      <NgWordEditor title='本文のNGワード' ngWords={ngWordTweet} onChangeNgWords={ngWordTweetChangeHandler} saveNgWords={saveNgWordTweetHandler} />
      <NgWordEditor title='ユーザ名のNGワード' ngWords={ngWordUsername} onChangeNgWords={ngWordUsernameChangeHandler} saveNgWords={saveNgWordUsernameHandler} />
      <UserList resetUserData={resetUserData} data={data} removeUser={removeUser} />
    </AppContainer>
  )
}

export default App
