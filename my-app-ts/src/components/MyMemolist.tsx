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
  const [editformOpen, setEditFormOpen] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState(''); // 編集フォームのタイトル入力値
  const [editContent, setEditContent] = useState(''); // 編集フォームのコンテンツ入力値

  type Order = 'up' | 'down';
  const[displayorder, setDisplayorder] = useState<Order>('up');
  const handleChange_order = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayorder(event.target.value as Order);
  };

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
        
        const responsedata = await response.json();
        
        //ここに更新日時で並び替えるコードを追加するよ...うまく動かないなあ
        if(displayorder==='down'){
          responsedata.data.sort((a:any, b:any) => {
          const dateA = new Date(a.made_date._seconds*1000); //firebaseの日時表示法を比べられるように書き換えてる
          const dateB = new Date(b.made_date._seconds*1000); //1970年1月1日からの秒数が_secondsとして管理されている
            return dateA.getTime() - dateB.getTime();
        });
        }
        if(displayorder==='up'){
          responsedata.data.sort((a:any, b:any) => {
          const dateA = new Date(a.made_date._seconds*1000);
          const dateB = new Date(b.made_date._seconds*1000);
          return dateB.getTime() - dateA.getTime();
        });
        }
        setMemos(responsedata.data || []); 
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
    

  }, [currentUser, apiEndpoint,displayorder ]); // currentUser または apiEndpoint が変わったら再実行

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
      setMemos(memos.filter(memo => memo.id !== memoId));
      alert('メモが正常に削除されました。');      
      
      
    } catch (err: any) {
      setError(`メモの削除エラー: ${err.message}`);
      console.error("メモの削除エラー:", err);
    }
  };

  const handleSubmitEdit = async (memoId: string) => {
    try {
      const url = `${apiEndpoint}?memoid=${encodeURIComponent(memoId)}`; 
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body : JSON.stringify({
          title: editTitle,
          content: editContent,
        })
      })
      window.location.reload() //とりま編集後の再読み込みはこれで...
    } catch (err: any) {
      setError(`編集エラー: ${err.message}`);
      console.error("編集エラー:", err);
    }
  }  

  if (loading) {
    return <div style={{padding: '20px' }}>Now Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div>      
      <select id="status-select" value={displayorder} onChange={handleChange_order}>
        <option value="up">新しい順</option>
        <option value="down">古い順</option>       
      </select>
      
      {memos.length === 0 ? (
        <p>まだメモがありません。新しいメモを作成してください！</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {memos.map((memo) => (
            
            <li key={memo.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' }}>
              
              
              {editformOpen === memo.id ? (
                // 編集フォーム
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  ></textarea>
                  <button onClick={() => {handleSubmitEdit(memo.id); setEditFormOpen(null)}} style={{ marginRight: '10px' }}>
                    更新
                  </button>
                  <button onClick={() => (setEditFormOpen(null))}>キャンセル</button>
                </div>
              ) : (
                // 通常のメモ表示
                <>
                  <h1 style={{ width: '100%', padding: '8px', marginBottom: '10px', textAlign:'left', color:'blue',}}>{memo.title}</h1>
                  <p style={{ width: '100%', padding: '8px', marginBottom: '10px', textAlign:'left'}}>
                    <div className='markdown'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                    
                    >
                      {memo.content}
                    </ReactMarkdown>
                    </div>
                  </p>
                  <button onClick={() => handleDelete(memo.id)} style={{ marginRight: '10px' }}>
                    削除
                  </button>
                  <button onClick={() => {setEditFormOpen(memo.id); setEditTitle(memo.title); setEditContent(memo.content)}}>編集</button>
                </>
              )}
            </li>


              )
            ) //mapここまで
          }
        </ul>
      )}
    </div>
  );
};

export default MyMemoList;