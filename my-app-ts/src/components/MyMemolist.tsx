import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth'; // FirebaseのUser型をインポート
import remarkGfm from 'remark-gfm'; //これを使うとコンテンツをマークダウンにできるよ

import ReactMarkdown from 'react-markdown';

interface MyMemoListProps {
  currentUser: User; // ログインユーザーの情報を必ず受け取るので User 型
  apiEndpoint: string; // APIエンドポイントも必要なので受け取る
}

const MyMemoList: React.FC<MyMemoListProps> = ({ currentUser, apiEndpoint }) => {
  const [memos, setMemos] = useState<any[]>([]); // メモの配列
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    // コンポーネントがマウントされたらメモを読み込む
    const fetchMemos = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${apiEndpoint}?user_id=${encodeURIComponent(currentUser.uid)}`;
        
        const response = await fetch(url, {
          method: 'GET',          
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'メモの取得に失敗しました');
        }

        const data = await response.json();
        setMemos(data.data || []); 
      } catch (err: any) {
        setError(`メモの読み込みエラー: ${err.message}`);
        console.error("メモの取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    // currentUser.uid が確定したらメモを取得
    if (currentUser && currentUser.uid) {
      fetchMemos();
    }
    

  }, [currentUser, apiEndpoint]); // currentUser または apiEndpoint が変わったら再実行

  const handleDelete = async (memoId: string) => {
    if (!window.confirm('本当にこのメモを削除しますか？')) {
      return; // キャンセルされたら処理を中断
    }

    try {
      const url = `${apiEndpoint}?memoid=${encodeURIComponent(memoId)}`; 
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 必要であれば認証トークンなどを追加
          // 'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'メモの削除に失敗しました');
      }

      // 削除が成功したら、ローカルのメモリストから該当のメモを削除
      setMemos(prevMemos => prevMemos.filter(memo => memo.id !== memoId));
      alert('メモが正常に削除されました。');
    } catch (err: any) {
      setError(`メモの削除エラー: ${err.message}`);
      console.error("メモの削除エラー:", err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>あなたのメモを読み込み中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div>
      <h2>{currentUser.displayName || currentUser.email}さんのメモ一覧</h2>
      
      {memos.length === 0 ? (
        <p>まだメモがありません。新しいメモを作成してください！</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {memos.map((memo) => (
            <li key={memo.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' }}>
              <h3>{memo.title}</h3>
              <p>                
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {memo.content}                  
                </ReactMarkdown>
              </p>
              
              <button onClick={() => handleDelete(memo.id)}>
                  削除
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyMemoList;