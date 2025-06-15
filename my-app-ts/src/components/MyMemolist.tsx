import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth'; // FirebaseのUser型をインポート

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
        // GETリクエストでユーザーのメモを取得
        // ここではAPIエンドポイントに対して、ユーザーIDをクエリパラメータとして送ることを想定
        // 例: YOUR_FIREBASE_FUNCTIONS_URL/mymemos?userId=user_uid_123
        // 関数側で /mymemos のようなパスで別の関数をトリガーする場合
        // もしくは、汎用的なRequested関数にuserIdを渡す場合
        
        // 仮に、GETリクエストでuserIdをクエリパラメータとして送る場合
        const url = `${apiEndpoint}?userId=${encodeURIComponent(currentUser.uid)}`;
        
        // もしFirebase Functions側で別途「自分のメモ取得用」の関数（例: getMyMemos）を用意するなら
        // const url = `https://<your-project-id>.<region>.cloudfunctions.net/getMyMemos?userId=${encodeURIComponent(currentUser.uid)}`;

        const response = await fetch(url, {
          method: 'GET',
          // 通常のGETリクエストではbodyは不要です
          // headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({ userId: currentUser.uid }) // Firebase Functionsがreq.bodyを読むなら
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'メモの取得に失敗しました');
        }

        const data = await response.json();
        setMemos(data.data || []); // 実際のメモデータはdata.dataに含まれると仮定
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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>あなたのメモを読み込み中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>{currentUser.displayName || currentUser.email}さんのメモ一覧</h2>
      
      {memos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>まだメモがありません。新しいメモを作成してください！</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {memos.map((memo) => (
            <li key={memo.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{memo.title}</h3>
              <p style={{ margin: '0', color: '#555', whiteSpace: 'pre-wrap' }}>{memo.content}</p>
              {/* 必要に応じて、編集ボタンや削除ボタンなどを追加 */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyMemoList;