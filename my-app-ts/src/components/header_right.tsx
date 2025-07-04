import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyADMuIYqy2Ke7naPLgh8N3z4HMoIIw0d6U",
  authDomain: "memocho-7cb5d.firebaseapp.com",
  databaseURL: "https://memocho-7cb5d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "memocho-7cb5d",
  storageBucket: "memocho-7cb5d.firebasestorage.app",
  messagingSenderId: "978589813771",
  appId: "1:978589813771:web:96e49d297328118a664b0e",
  measurementId: "G-SQG3T1NCLJ"
};

// Firebaseアプリの初期化（アプリ全体で一度だけ行われるべき処理）
// アプリケーションのエントリポイント (例: index.tsx) で行うのが理想的ですが、
// この例ではコンポーネント内で完結させるためここで行っています。
// 既にApp.tsxやindex.tsxでinitializeAppしている場合は、重複しないよう削除してください。
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authサービスを取得
const googleProvider = new GoogleAuthProvider(); // Google認証プロバイダをインスタンス化

// AuthButton コンポーネントのプロップスの型定義
interface AuthButtonProps {
  onUserChange?: (user: User | null) => void; // ユーザー情報が変更されたときに親に通知するコールバック
}

const AuthButton: React.FC<AuthButtonProps> = ({ onUserChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 認証状態の初期ロード中か

  useEffect(() => {
    // 認証状態の変化を監視するリスナーを設定
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ユーザー情報をステートにセット
      setLoading(false);    // ロード完了
      if (onUserChange) {
        onUserChange(currentUser); // 親コンポーネントにユーザー情報を通知
      }
    });

    // コンポーネントがアンマウントされるときにリスナーを解除
    return () => unsubscribe();
  }, [onUserChange]); // onUserChangeが変更されたらエフェクトを再実行

  // Googleログイン処理
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // ログイン成功するとonAuthStateChangedが発火し、userステートが更新される
      console.log("Googleログイン成功！");
    } catch (error: any) {
      // ログイン失敗時のエラーハンドリング
      console.error("Googleログインエラー:", error.message);
      alert(`Googleログインに失敗しました: ${error.message}`);
    }
  };

  // ログアウト処理
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // ログアウト成功するとonAuthStateChangedが発火し、userステートがnullになる
      console.log("ログアウト成功！");
    } catch (error: any) {
      // ログアウト失敗時のエラーハンドリング
      console.error("ログアウトエラー:", error.message);
      alert(`ログアウトに失敗しました: ${error.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px', fontSize: '1.2em' }}>認証状態を確認中...</div>;
  }

  return (
    <div>
      {user ? (
        // ログイン中の場合
        
        <div>
          <button onClick={handleSignOut} className='headerbutton'>
            ログアウト
          </button>
          
          <p style= {{float:"right",top:"50%"}}>
            {user.displayName || user.email || '名無しさん'}でログイン中
          </p>

          {user.photoURL && ( //user.photoURLがTrueの時のみ、imgがレンダリングされるという構文
            <img 
              src={user.photoURL} 
              alt="プロフィール画像" 
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' }} 
              
            />
          )}
          
        </div>
      ) : (
        // ログインしていない場合
        <div>
          <button 
            onClick={handleGoogleSignIn}
            style={{ 
              
              color: 'black',               
            }}>            
            Googleでログイン
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;