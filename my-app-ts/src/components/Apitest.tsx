import React from 'react'; // Reactをインポート
import SendForm from './Send_forms';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

const FIREBASE_FUNCTIONS_URL_TESTFUNC = 'https://us-central1-memocho-7cb5d.cloudfunctions.net/Test_request'; 


function Apitest(){
  return (
  
    <div>           
      <p>開発用のAPI接続テストページだよ</p>
        <p style={{color:"red"}} >普段はさわらないでね</p>
        <SendForm apiEndpoint={FIREBASE_FUNCTIONS_URL_TESTFUNC} />
      
      <Link to='/'>閉じる</Link>
      
      
    </div>
  );
};
export default Apitest;