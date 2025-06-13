import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Apitest from './components/Apitest';
import AuthButton from './components/Authbutton';
import { useState } from 'react';
import { User } from 'firebase/auth';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // ⭐ ここにAPIのエンドポイントURLを設定してください
  
  return (
    <div className="App">
      <BrowserRouter>  
      
      <header className="App-header">      
        <p>
          ヘッダーだよ
        </p>
        <AuthButton></AuthButton>
      </header>

      

      <Link to='/Apitest'>APIテストページはこちら</Link>

        <Routes>
          <Route path='/apitest' Component={Apitest} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
