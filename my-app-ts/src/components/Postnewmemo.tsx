import React,{useState} from 'react';
import { User } from 'firebase/auth'; // FirebaseのUser型をインポート
import {FieldValue, Timestamp} from 'firebase/firestore';

interface NewmemoProps {
  currentUser: User; // ログインユーザーの情報を必ず受け取るので User 型
  apiEndpoint: string; // 投稿先のDBに関するエンドポイントを置く
}

const PostnewMemo: React.FC<NewmemoProps> = ({ currentUser, apiEndpoint }) => {
  const[memocontent, setMemoContent] = useState<string>("何か入力してね");
  const[memotitle, setMemoTitle] = useState<string>("");

  const handlePostSubmit = async () => {
    if (!memotitle){
      setMemoTitle("無題")
    }
    if (!memocontent){
      setMemoContent("No content")
    }
    // ロケールを指定して日付を取得するサンプルコード
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const madeDate: FieldValue = Timestamp.now()
  const updatedDate: FieldValue = Timestamp.now()

  try{
    const response = await fetch(apiEndpoint, {
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          user: currentUser,
          madeDate: madeDate,
          updatedDate: updatedDate,
          title: memotitle,
          content:memocontent,
        }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '投稿失敗');
      }
      
  }catch (error:any){
    console.error('POSTエラー:',error);
    }
  };

    return (
      <div>
        <p>新規メモ投稿フォームをここに作るよ</p>
        <div className="newpostcontent">
          <label htmlFor="memo-title">タイトル：</label>
          <input
            id="post-id"
            type="text"
            value={memotitle}
            onChange={(e) => setMemoTitle(e.target.value)}
            placeholder="タイトルを入力"
          />
          <label htmlFor="memo-content">内容：</label>
          <input
            id="post-id"
            type="text"
            value={memocontent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="内容を入力"
          />
          </div>  
          <button onClick={handlePostSubmit}>投稿する</button>
      </div>
      
    )


}
export default PostnewMemo