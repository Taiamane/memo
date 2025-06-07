import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Howtouse from './components/Howtouse';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/howtouse' Component={Howtouse} />
        </Routes>  
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          これをメモ帳アプリの雛形とする！！
        </p>
          <Link to='/howtouse'>使い方のページはこちら</Link>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      </BrowserRouter>
    </div>
  );
}

export default App;
