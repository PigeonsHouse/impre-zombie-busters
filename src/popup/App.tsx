import { useEffect, useState } from 'react';
import './App.css'
import { decodeUserDataList, INVISIBLE_USERS, InvisibleReasons, InvisiBleUsers } from '../utils';

function App() {
  const [data, setData] = useState<InvisiBleUsers>({});

  useEffect(() => {
    chrome.storage.local.get(INVISIBLE_USERS).then(v => {
      setData(decodeUserDataList(v[INVISIBLE_USERS]));
    });
  }, []);

  const getJapaneseReason = (reason: InvisibleReasons) => {
    switch (reason) {
      case InvisibleReasons.EmojiOnly:
        return '絵文字のみのツイート'
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
  }

  // TODO: styleをCSSファイルに移植する
  // TODO: onClickをuseCallbackに切り出す
  // TODO: NGワード設定UIの作成
  // TODO: 非表示ユーザの削除処理作成
  return (
    <div id='app'>
      <p onClick={() => {
        chrome.storage.local.set({invisibleUsers: ""});
        setData({});
      }} style={{backgroundColor: '#ddd'}}>全部消す</p>
      {Object.entries(data).map(([id, userData]) => {
        return (
          <p style={{backgroundColor: '#ddd', padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '4px', borderRadius: '4px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <img src={userData.avatar} alt='' width={30} height={30} style={{borderRadius: '30px'}} />
                <div style={{fontWeight: 'bold'}}>{userData.name}</div>
                <div
                  onClick={() => {
                    chrome.tabs.create({url: `https://x.com/${id.substring(1)}`})
                  }}
                  style={{color: '#1da1f2', textDecoration: 'underline', cursor: 'pointer'}}
                >
                  {id}
                </div>
              </div>
              <div
                style={{cursor: 'pointer', backgroundColor: '#999', color: 'white', fontWeight:'bold', height: '20px', width: '20px', textAlign:'center', borderRadius: '30px'}}
                onClick={() => alert('未実装！！')}
              >
                x
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between'}}>
              <div>原因: {getJapaneseReason(userData.reason)}</div>
              <div
                onClick={() => {
                  chrome.tabs.create({url: userData.contentId})
                }}
                style={{backgroundColor: '#999', color: 'white', borderRadius: '8px', padding: '0 4px', cursor: 'pointer'}}
              >
                該当のツイートを見る
              </div>
            </div>
          </p>
        )
      })}
    </div>
  )
}

export default App
