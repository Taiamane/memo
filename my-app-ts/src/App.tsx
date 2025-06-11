import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Howtouse from './components/Howtouse';
import SendForm from './components/Send_forms';

function App() {

  // ⭐ ここにAPIのエンドポイントURLを設定してください
  const FIREBASE_FUNCTIONS_URL_TESTFUNC = 'https://us-central1-memocho-7cb5d.cloudfunctions.net/Test_request'; 

  return (
    <div className="App">
      <BrowserRouter>  
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          これをメモ帳アプリの雛形とする！！
        </p>
        <SendForm apiEndpoint={FIREBASE_FUNCTIONS_URL_TESTFUNC} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <Link to='/howtouse'>使い方のページはこちら</Link>
        <Routes>
          <Route path='/howtouse' Component={Howtouse} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
