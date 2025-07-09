import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Apitest from './components/Apitest';
import AuthButton from './components/header_right';
import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import MyMemoList from './components/MyMemolist';
import PostnewMemo from './components/Postnewmemo';
import Markdown_system from './components/Markdown_system';
import Howtouse from './components/Howtouse';

const MEMOCONTROL_URL = 'https://us-central1-memocho-7cb5d.cloudfunctions.net/Memo_control';



function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [postformopen, setPostformopen] = useState <boolean>(false);
  const handleUserChange = useCallback((user: User | null) => { //よくわかってない
    setCurrentUser(user);
    console.log("App.tsx: ユーザー情報が更新されました:", user ? user.uid : "ログアウト");
  }, []);
  // ⭐ ここにAPIのエンドポイントURLを設定してください

  
  
  return (
    <div className="App">
      <BrowserRouter>  
      
        <header className="App-header">      
          <a href="/">
            <p className="title">
              ヘッダーだよ
            </p>
          </a>
          <div className='sidepage'>
            <a href="/Howtouse">説明書</a>
            <a href="/Markdown_system">マークダウンの書式について</a>
          </div>
          <div className='Header-right'>
            <AuthButton onUserChange={handleUserChange}></AuthButton>       
          </div>
        </header>

        <Routes>
          <Route path='/' element={
            // ホームページにのみ表示したい要素をここに記述
          <div>
                <p>ホームページだよ</p>
              {currentUser ? (
                <div>
                  {!postformopen && (
                  <div>
                    <button onClick={()=>setPostformopen(true)}>あたらしくつくる</button>
                  </div>
                  )}
                  {postformopen &&(
                    <div>
                    <button onClick={()=>setPostformopen(false)}>閉じる</button>
                    <PostnewMemo currentUser={currentUser} apiEndpoint={MEMOCONTROL_URL}></PostnewMemo>
                    </div>
                  )}                  
                
                  {<MyMemoList currentUser={currentUser} apiEndpoint={MEMOCONTROL_URL} />}
                </div>
              ) : (
                <p>
                  ログインしてないよ
                </p>
              )}
                        
              <Link to="/apitest">APIテストフォームを表示する </Link>
              
            </div>
            } />                      

          <Route path='/apitest' Component={Apitest} />

          <Route path='/Markdown_system' Component={Markdown_system} />
          <Route path='/Howtouse' Component={Howtouse} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
