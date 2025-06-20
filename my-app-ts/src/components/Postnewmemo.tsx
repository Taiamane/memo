import React,{useState} from 'react';
import { User } from 'firebase/auth'; // FirebaseのUser型をインポート


interface NewmemoProps {
  currentUser: User; // ログインユーザーの情報を必ず受け取るので User 型
  apiEndpoint: string; // APIエンドポイントも必要なので受け取る
}

const PostnewMemo: React.FC<NewmemoProps> = ({ currentUser, apiEndpoint }) => {
  const[memocontent, setMemoContent] = useState<string>("何か入力してね");
  const[memotitle, setMemoTitle] = useState<string>("");

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
            placeholder="IDを入力"
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
      </div>  )


}
export default PostnewMemo