import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Apitest from './components/Apitest';
import AuthButton from './components/header_right';
import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import MyMemoList from './components/MyMemolist';
import PostnewMemo from './components/Postnewmemo';
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
              Markdown memocho
            </p>
          </a>
          <div className='sidepage'>
            <a href="/Howtouse">説明書</a>
            <a onClick={()=>setPostformopen(true)}>新規作成</a>
            
          </div>
          <div className='Header-right'>
            <AuthButton onUserChange={handleUserChange}></AuthButton>       
          </div>
        </header>

        <Routes>
          <Route path='/' element={
            // ホームページにのみ表示したい要素をここに記述
          <div>                
              {currentUser ? (
                <div>
                  
                  {postformopen &&(
                    <div>
                      <PostnewMemo currentUser={currentUser} apiEndpoint={MEMOCONTROL_URL}></PostnewMemo>
                      <button onClick={()=>setPostformopen(false)}>閉じる</button>
                    </div>
                  )}                  
                
                  {<MyMemoList currentUser={currentUser} apiEndpoint={MEMOCONTROL_URL} />}
                </div>
              ) : (
                <p>
                  ログインしてないよ
                </p>
              )}
                        
              {/* <Link to="/apitest">APIテストフォームを表示する </Link> */}
              
            </div>
            } />                      

          <Route path='/apitest' Component={Apitest} />
          <Route path='/Howtouse' Component={Howtouse} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
