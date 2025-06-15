import React from 'react';
import { User } from 'firebase/auth'; // FirebaseのUser型をインポート

interface NewmemoProps {
  currentUser: User; // ログインユーザーの情報を必ず受け取るので User 型
  apiEndpoint: string; // APIエンドポイントも必要なので受け取る
}

const PostnewMemo: React.FC<NewmemoProps> = ({ currentUser, apiEndpoint }) => {
    return (
        <p>新規メモ投稿フォームをここに作るよ</p>
    )


}
export default PostnewMemo