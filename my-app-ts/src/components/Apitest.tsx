import React from 'react'; // Reactをインポート
import SendForm from './Send_forms';

const FIREBASE_FUNCTIONS_URL_TESTFUNC = 'https://us-central1-memocho-7cb5d.cloudfunctions.net/Test_request'; 


function Apitest(){
  return (
    <div>      
      <p>
        テストページだよ
        <SendForm apiEndpoint={FIREBASE_FUNCTIONS_URL_TESTFUNC} />
      </p>
    </div>
  );
};
export default Apitest;