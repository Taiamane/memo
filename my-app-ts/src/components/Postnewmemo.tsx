import React,{useState} from 'react';
import { User } from 'firebase/auth'; // FirebaseのUser型をインポート
import '../mainpage.css'

interface NewmemoProps {
  currentUser: User; // ログインユーザーの情報を必ず受け取るので User 型
  apiEndpoint: string; // 投稿先のDBに関するエンドポイントを置く
}

const PostnewMemo: React.FC<NewmemoProps> = ({ currentUser, apiEndpoint }) => {
  const[memocontent, setMemoContent] = useState<string>("");
  const[memotitle, setMemoTitle] = useState<string>("");

  const [postResponse, setPostResponse] = useState<string | null>(null);

  const handlePostSubmit = async () => {
    if (!memotitle){
      setMemoTitle("無題")
    }
    if (!memocontent){
      setMemoContent("No content")
    }
  
  try{
    const response = await fetch(apiEndpoint, {
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          user_id: currentUser.uid,
          title: memotitle,
          content:memocontent,
        }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '投稿失敗');
      }
    const data = await response.json();
    setPostResponse(`POST成功: ${JSON.stringify(data, null, 2)}`);
      
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
            className="memoedit_andmake"
          />
          <label htmlFor="memo-content">内容：</label>
          <textarea
            id="post-id"
            value={memocontent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="何か入力してね"
            className ='memoedit_andmake'
          />
          </div>  
          <button onClick={handlePostSubmit}>投稿する</button>
      </div>
      
    )

}
export default PostnewMemo