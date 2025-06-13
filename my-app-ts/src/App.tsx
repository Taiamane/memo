import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Apitest from './components/Apitest';
import AuthButton from './components/Authbutton';
import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';

const FIREBASE_FUNCTIONS_URL = 'YOUR_FIREBASE_FUNCTIONS_URL';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const handleUserChange = useCallback((user: User | null) => {
    setCurrentUser(user);
    console.log("App.tsx: ユーザー情報が更新されました:", user ? user.uid : "ログアウト");
  }, []);
  // ⭐ ここにAPIのエンドポイントURLを設定してください
  
  return (
    <div className="App">
      <BrowserRouter>  
      
        <header className="App-header">      
          <p style= {{
            color:"white",
          }}
          >
          ヘッダーだよ
          </p>
          <AuthButton onUserChange={handleUserChange}></AuthButton>       
        </header>

        <Routes>
          <Route path='/' element={
            // ホームページにのみ表示したい要素をここに記述
            <div>
              <p>
                ホームページだよ
              </p>
              
              {currentUser ? (
                <div>
                  <h2>ログインしてる時だけ見れる部分だよ</h2>
                  {/* <SendForm apiEndpoint={FIREBASE_FUNCTIONS_URL} currentUserId={currentUser.uid} /> */}
                </div>
              ) : (
                <p>
                  ログインしてないよ
                </p>
              )}
              <Link to="/apitest">APIテストフォームを表示する</Link>
            </div>
            } />   


          <Route path='/apitest' Component={Apitest} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
